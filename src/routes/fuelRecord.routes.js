// src/routes/fuelRecord.routes.js
import express from 'express';

import * as fuelController from '../controllers/fuelRecord.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createFuelRecordSchema,
  updateFuelRecordSchema,
} from '../validators/fuelRecord.validator.js';

const router = express.Router();

router.use(authenticate);

// Admin ou Chauffeur (le chauffeur peut enregistrer son plein)
router.post(
  '/',
  authorize('Admin', 'Chauffeur'),
  validate(createFuelRecordSchema),
  fuelController.createFuelRecord
);

// GET /api/fuel?page=1&limit=10&truckId=xxx&driverId=xxx
router.get('/', fuelController.getFuelRecords);

router.get('/:id', fuelController.getFuelRecord);

router.put(
  '/:id',
  authorize('Admin'),
  validate(updateFuelRecordSchema),
  fuelController.updateFuelRecord
);

router.delete('/:id', authorize('Admin'), fuelController.deleteFuelRecord);

export default router;
