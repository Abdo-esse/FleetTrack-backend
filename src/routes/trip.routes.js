// src/routes/trip.routes.js
import express from 'express';

import * as tripController from '../controllers/trip.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createTripSchema,
  assignDriverSchema,
  updateTripStatusSchema,
} from '../validators/trip.validator.js';

const router = express.Router();

router.use(authenticate);

/* Création trajet (Admin) */
router.post('/', authorize('Admin'), validate(createTripSchema), tripController.createTrip);

/* Assigner un chauffeur */
router.patch(
  '/:id/assign-driver',
  authorize('Admin'),
  validate(assignDriverSchema),
  tripController.assignDriver
);

/* Modifier état du trajet */
router.patch(
  '/:id/status',
  authorize('Admin', 'Chauffeur'),
  validate(updateTripStatusSchema),
  tripController.updateTripStatus
);

/* Consulter trajets avec filtres */
router.get('/', tripController.getTrips);

/* Détail trajet */
router.get('/:id', tripController.getTrip);

/* Suppression (Admin) */
router.delete('/:id', authorize('Admin'), tripController.deleteTrip);

/* Compléter un trajet (Chauffeur) */
router.patch('/:id/complete', authorize('Chauffeur'), tripController.completeTrip);

export default router;
