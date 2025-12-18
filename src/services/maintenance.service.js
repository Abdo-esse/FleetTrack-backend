// src/services/maintenance.service.js
import MaintenanceRule from '../models/maintenanceRule.js';
import MaintenanceRecord from '../models/maintenanceRecord.js';
import MaintenanceAlert from '../models/maintenanceAlert.js';

import { resolveAlerts } from './maintenanceAlert.service.js';
import Truck from '../models/truck.js';
import Trailer from '../models/trailer.js';
import Tire from '../models/tire.js';
import { triggerAlert } from './maintenanceAlert.service.js';

export const getMaintenanceAlerts = async (query) => {
  const {
    page = 1,
    limit = 10,
    status = 'active', // active | resolved | all
    targetType, // Truck | Trailer | Tire
    search, // id véhicule
    sort = 'triggeredAt:desc',
  } = query;

  /* Check maintenance */
  console.log('Checking maintenance...');
  await checkMaintenance();
  console.log('Maintenance checked');

  /* Pagination */
  const pageNumber = Math.max(parseInt(page, 10), 1);
  const limitNumber = Math.max(parseInt(limit, 10), 1);
  const skip = (pageNumber - 1) * limitNumber;

  /* Filtres */
  const filters = {};

  if (status !== 'all') {
    filters.status = status;
  }

  if (targetType) {
    filters.targetType = targetType;
  }

  if (search) {
    filters.targetId = search;
  }

  /* Tri */
  const [sortField, sortOrder] = sort.split(':');
  const sortOptions = {
    [sortField]: sortOrder === 'asc' ? 1 : -1,
  };
  /* Query */
  const [alerts, total] = await Promise.all([
    MaintenanceAlert.find(filters)
      .populate('ruleId', 'name description')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber),
    MaintenanceAlert.countDocuments(filters),
  ]);

  return {
    data: alerts,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
    filtersApplied: {
      status,
      targetType,
      search,
      sort,
    },
  };
};

export const checkTruckMaintenance = async (truck) => {
  console.log(truck.mileage);
  const rules = await MaintenanceRule.find({
    targetType: 'Truck',
    isActive: true,
  });

  const alerts = [];

  for (const rule of rules) {
    const lastRecord = await MaintenanceRecord.findOne({
      ruleId: rule._id,
      targetId: truck._id,
    }).sort({ performedAt: -1 });

    let dueByKm = false;
    let dueByTime = false;

    if (rule.intervalKm && lastRecord?.mileageAtService !== undefined) {
      console.log(truck.mileage - lastRecord.mileageAtService);
      dueByKm = truck.mileage - lastRecord.mileageAtService >= rule.intervalKm;
    }else if(rule.intervalKm && lastRecord?.mileageAtService === undefined){
      console.log(truck.mileage);
      dueByKm = truck.mileage >= rule.intervalKm;
    }

    if (rule.intervalDays && lastRecord?.performedAt) {
      const days = (Date.now() - lastRecord.performedAt.getTime()) / (1000 * 60 * 60 * 24);
      dueByTime = days >= rule.intervalDays;
    }else if(rule.intervalDays && lastRecord?.performedAt === undefined){
      dueByTime = Date.now() >= rule.intervalDays;
    }

    if (dueByKm || dueByTime) {
      alerts.push({
        ruleId: rule._id,
        rule: rule.name,
        dueByKm,
        dueByTime,
      });
    }
  }

  return alerts;
};

export const checkTireMaintenance = async (tire) => {
  console.log(tire.wearLevel);
  const rules = await MaintenanceRule.find({
    targetType: 'Tire',
    isActive: true,
  });

  const alerts = [];

  for (const rule of rules) {
    if (rule.wearThreshold !== undefined && tire.wearLevel >= rule.wearThreshold) {
      console.log(tire.wearLevel);
      alerts.push({
        ruleId: rule._id,
        rule: rule.name,
        dueByWear: true,
        currentWear: tire.wearLevel,
        threshold: rule.wearThreshold,
      });
    }
  }

  return alerts;
};

export const checkTrailerMaintenance = async (trailer) => {
  const rules = await MaintenanceRule.find({
    targetType: 'Trailer',
    isActive: true,
  });

  const alerts = [];

  for (const rule of rules) {
    const lastRecord = await MaintenanceRecord.findOne({
      ruleId: rule._id,
      targetId: trailer._id,
    }).sort({ performedAt: -1 });

    let dueByKm = false;
    let dueByTime = false;

    if (rule.intervalKm && lastRecord?.mileageAtService !== undefined) {
      dueByKm = trailer.mileage - lastRecord.mileageAtService >= rule.intervalKm;
    }

    if (rule.intervalDays && lastRecord?.performedAt) {
      const days = (Date.now() - lastRecord.performedAt.getTime()) / (1000 * 60 * 60 * 24);
      dueByTime = days >= rule.intervalDays;
    }

    if (dueByKm || dueByTime) {
      alerts.push({
        rule: rule.name,
        dueByKm,
        dueByTime,
      });
    }
  }

  return alerts;
};

//check maintenance for all vehicles (trucks, trailers, tires), get all trucks, trailers, tires and check maintenance, puis create alerts
export const checkMaintenance = async () => {
  console.log('Checking maintenance...');
  const trucks = await Truck.find({});
  const trailers = await Trailer.find({});
  const tires = await Tire.find({});

  for (const truck of trucks) {
    const alerts = await checkTruckMaintenance(truck);
    if (alerts.length > 0) {
      console.log('Triggering alert for truck ' + alerts);
      await triggerAlert({
        ruleId: alerts[0].ruleId,
        targetType: 'Truck',
        targetId: truck._id,
        reason: alerts[0].dueByKm ? 'dueByKm' : 'dueByTime',
        details: alerts[0],
      });
    }
  }

  for (const trailer of trailers) {
    const alerts = await checkTrailerMaintenance(trailer);
    if (alerts.length > 0) {
      console.log('Triggering alert for trailer ' + alerts);
      await triggerAlert({
        ruleId: alerts[0].ruleId,
        targetType: 'Trailer',
        targetId: trailer._id,
        reason: alerts[0].dueByKm ? 'dueByKm' : 'dueByTime',
        details: alerts[0],
      });
    }
  }

  for (const tire of tires) {
    const alerts = await checkTireMaintenance(tire);
    if (alerts.length > 0) {
      console.log('Triggering alert for tire ' + alerts);
      await triggerAlert({
        ruleId: alerts[0].ruleId,
        targetType: 'Tire',
        targetId: tire._id,
        reason: alerts[0].dueByWear ? 'dueByWear' : 'dueByTime',
        details: alerts[0],
      });
    }
  }
};

export const createMaintenanceRecord = async (data) => {
  const record = await MaintenanceRecord.create({
    ruleId: data.ruleId,
    targetId: data.targetId,
    targetType: data.targetType,
    mileageAtService: data.mileageAtService,
    wearLevelAtService: data.wearLevelAtService,
    cost: data.cost,
    notes: data.notes,
  });

  await resolveAlerts(data.ruleId, data.targetId);

  return record;
};

export const resolveMaintenanceAlert = async (alertId) => {
  const alert = await MaintenanceAlert.findById(alertId);

  if (!alert) {
    throw new Error('Maintenance alert not found');
  }
    console.log("debut de resolveAlerts");
   await resolveAlerts(alert.ruleId, alert.targetId);

  return alert;
};
