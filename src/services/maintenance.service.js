// src/services/maintenance.service.js
import MaintenanceRule from '../models/maintenanceRule.js';
import MaintenanceRecord from '../models/maintenanceRecord.js';
import Truck from '../models/truck.js';

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
  return MaintenanceRecord.create({
    ruleId: data.ruleId,
    targetId: data.targetId,
    targetType: data.targetType,
    mileageAtService: data.mileageAtService,
    wearLevelAtService: data.wearLevelAtService,
    cost: data.cost,
    notes: data.notes,
  });
};

export const getTruckMaintenanceAlerts = async (truckId) => {
  const truck = await Truck.findById(truckId);

  if (!truck) {
    throw new Error('Truck not found');
  }

  return checkTruckMaintenance(truck);
};
