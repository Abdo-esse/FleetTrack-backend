import MaintenanceAlert from '../models/maintenanceAlert.js';
import Truck from '../models/truck.js';
import Trailer from '../models/trailer.js';
import Tire from '../models/tire.js';
import MaintenanceRecord from '../models/maintenanceRecord.js';
/**
 * Crée ou met à jour une alerte
 */
export const triggerAlert = async ({ ruleId, targetType, targetId, reason, details }) => {
  const existing = await MaintenanceAlert.findOne({
    ruleId,
    targetType,
    targetId,
    status: 'active',
  });

  if (existing) return existing;

  return MaintenanceAlert.create({
    ruleId,
    targetType,
    targetId,
    reason,
    details,
  });
};

/**
 * Résout les alertes après maintenance
 */
export const resolveAlerts = async (ruleId, targetId) => {
 console.log("debut de resolveAlerts");
  const alert = await MaintenanceAlert.findOne({
    ruleId,
    targetId,
    status: 'active',
  });

  if (!alert) return;

  await MaintenanceAlert.updateMany(
    { ruleId, targetId, status: 'active' },
    { status: 'resolved', resolvedAt: new Date() }
  );

  console.log("alertsClosed",alert);
  switch (alert.targetType) {
    case 'Truck':
      console.log("debut de resolveAlerts Truck");
      const truck = await Truck.findById(targetId);
      MaintenanceRecord.create({
        ruleId,
        targetType: alert.targetType,
        targetId,
        mileageAtService: truck.mileage,
      });
      console.log("fin de resolveAlerts Truck");
      break;
    case 'Trailer':
      const trailer = await Trailer.findById(targetId);
      MaintenanceRecord.create({
        ruleId,
        targetType: alert.targetType,
        targetId,
        mileageAtService: trailer.mileage,
      });
      break;
    case 'Tire':
      const tire = await Tire.findById(targetId);
      MaintenanceRecord.create({
        ruleId,
        targetType: alert.targetType,
        targetId,
        wearLevelAtService: tire.wearLevel,
      });
      break;
    default:
      break;
  }
  console.log("fin de resolveAlerts");
};

