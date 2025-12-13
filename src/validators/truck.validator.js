// src/validators/truck.validator.js
import Joi from 'joi';

export const createTruckSchema = Joi.object({
  registrationNumber: Joi.string().required(),
  brand: Joi.string().required(),
  model: Joi.string().required(),
  mileage: Joi.number().min(0).optional(),
  status: Joi.string().valid('available', 'maintenance', 'unavailable').optional(),
});

export const updateTruckSchema = Joi.object({
  brand: Joi.string().optional(),
  model: Joi.string().optional(),
  mileage: Joi.number().min(0).optional(),
  status: Joi.string().valid('available', 'maintenance', 'unavailable').optional(),
});
