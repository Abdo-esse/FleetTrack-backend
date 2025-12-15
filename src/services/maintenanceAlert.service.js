import MaintenanceAlert from '../models/maintenanceAlert.js';

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
  await MaintenanceAlert.updateMany(
    {
      ruleId,
      targetId,
      status: 'active',
    },
    {
      status: 'resolved',
      resolvedAt: new Date(),
    }
  );
};
