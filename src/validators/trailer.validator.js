// src/validators/trailer.validator.js
import Joi from 'joi';

export const createTrailerSchema = Joi.object({
  registrationNumber: Joi.string().required(),
  type: Joi.string().required(),
  mileage: Joi.number().min(0).required(),
  status: Joi.string().valid('available', 'maintenance', 'unavailable'),
});

export const updateTrailerSchema = Joi.object({
  registrationNumber: Joi.string(),
  type: Joi.string(),
  mileage: Joi.number().min(0),
  status: Joi.string().valid('available', 'maintenance', 'unavailable'),
});
