// src/services/maintenance.service.js
import MaintenanceRule from '../models/maintenanceRule.js';
import MaintenanceRecord from '../models/maintenanceRecord.js';
import MaintenanceAlert from '../models/maintenanceAlert.js';

import { resolveAlerts } from './maintenanceAlert.service.js';

export const getMaintenanceAlerts = async (query) => {
  const {
    page = 1,
    limit = 10,
    status = 'active', // active | resolved | all
    targetType, // Truck | Trailer | Tire
    search, // id véhicule
    sort = 'triggeredAt:desc',
  } = query;

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
      dueByKm = truck.mileage - lastRecord.mileageAtService >= rule.intervalKm;
    }

    if (rule.intervalDays && lastRecord?.performedAt) {
      const days = (Date.now() - lastRecord.performedAt.getTime()) / (1000 * 60 * 60 * 24);
      dueByTime = days >= rule.intervalDays;
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
  const rules = await MaintenanceRule.find({
    targetType: 'Tire',
    isActive: true,
  });

  const alerts = [];

  for (const rule of rules) {
    if (rule.wearThreshold !== undefined && tire.wearLevel >= rule.wearThreshold) {
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
