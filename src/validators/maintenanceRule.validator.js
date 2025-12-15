// src/validators/maintenanceRule.validator.js
import Joi from 'joi';

export const createMaintenanceRuleSchema = Joi.object({
  name: Joi.string().min(3).required(),

  targetType: Joi.string().valid('Truck', 'Trailer', 'Tire').required(),

  intervalKm: Joi.number().min(0).optional(),

  intervalDays: Joi.number().min(0).optional(),

  wearThreshold: Joi.number().min(0).max(100).optional(),

  description: Joi.string().allow('', null),

  isActive: Joi.boolean().optional(),
}).or('intervalKm', 'intervalDays', 'wearThreshold'); // Au moins une règle

export const updateMaintenanceRuleSchema = Joi.object({
  name: Joi.string().min(3).optional(),

  intervalKm: Joi.number().min(0).optional(),

  intervalDays: Joi.number().min(0).optional(),

  wearThreshold: Joi.number().min(0).max(100).optional(),

  description: Joi.string().allow('', null),

  isActive: Joi.boolean().optional(),
});
