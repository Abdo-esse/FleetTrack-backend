// src/validators/driver.validator.js
import Joi from 'joi';

export const updateDriverSchema = Joi.object({
  name: Joi.string().optional(),
  phone: Joi.string().optional(),
  licenseNumber: Joi.string().optional(),
  status: Joi.string().valid('active', 'suspended').optional(),
});
