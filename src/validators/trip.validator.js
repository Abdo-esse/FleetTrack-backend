// src/validators/trip.validator.js
import Joi from 'joi';

export const createTripSchema = Joi.object({
  truckId: Joi.string().required(),
  trailerId: Joi.string().optional().allow(null),
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  departureMileage: Joi.number().positive().optional(),
});

export const assignDriverSchema = Joi.object({
  driverId: Joi.string().required(),
});

export const updateTripStatusSchema = Joi.object({
  status: Joi.string().valid('planned', 'in_progress', 'completed', 'cancelled').required(),
  departureMileage: Joi.number().positive().optional(),

});
