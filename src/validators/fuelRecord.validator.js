// src/validators/fuelRecord.validator.js
import Joi from 'joi';

export const createFuelRecordSchema = Joi.object({
  truckId: Joi.string().required(),
  driverId: Joi.string().required(),
  liters: Joi.number().positive().required(),
  cost: Joi.number().positive().required(),
  date: Joi.date().optional(),
});

export const updateFuelRecordSchema = Joi.object({
  liters: Joi.number().positive().optional(),
  cost: Joi.number().positive().optional(),
  date: Joi.date().optional(),
});
