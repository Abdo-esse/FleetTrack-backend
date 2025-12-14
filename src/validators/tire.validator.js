// src/validators/tire.validator.js
import Joi from 'joi';

/* Positions autorisées pour les pneus */
const positions = [
  'avant gauche',
  'avant droit',
  'arrière gauche',
  'arrière droit',
  'centre gauche',
  'centre droit',
  'de secours',
];

/* Schéma pour créer un pneu */
export const createTireSchema = Joi.object({
  reference: Joi.string().trim().required(),
  position: Joi.string()
    .valid(...positions)
    .required(),
  wearLevel: Joi.number().min(0).max(100).default(0),
  truckId: Joi.string().optional().allow(null),
  trailerId: Joi.string().optional().allow(null),
});

/* Schéma pour mettre à jour un pneu */
export const updateTireSchema = Joi.object({
  reference: Joi.string().trim().optional(),
  position: Joi.string()
    .valid(...positions)
    .optional(),
  wearLevel: Joi.number().min(0).max(100).optional(),
  truckId: Joi.string().optional().allow(null),
  trailerId: Joi.string().optional().allow(null),
});

export const assignTireSchema = Joi.object({
  truckId: Joi.string().allow(null),
  trailerId: Joi.string().allow(null),
});

export const updateWearSchema = Joi.object({
  wearLevel: Joi.number().min(0).max(100).required(),
  note: Joi.string().optional(),
});
