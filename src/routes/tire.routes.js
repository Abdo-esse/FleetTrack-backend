// src/routes/tire.routes.js
import express from 'express';

import * as tireController from '../controllers/tire.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createTireSchema,
  updateTireSchema,
  assignTireSchema,
  updateWearSchema,
} from '../validators/tire.validator.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('Admin'), validate(createTireSchema), tireController.createTire);

router.get('/', tireController.getTires); // pagination + filtres + recherche
router.get('/:id', tireController.getTire);

router.put('/:id', authorize('Admin'), validate(updateTireSchema), tireController.updateTire);

router.delete('/:id', authorize('Admin'), tireController.deleteTire);

router.put(
  '/:id/assign',
  authorize('Admin'),
  validate(assignTireSchema),
  tireController.assignTire
);

router.put('/:id/wear', authorize('Admin'), validate(updateWearSchema), tireController.updateWear);

router.get('/:id/history', authorize('Admin'), tireController.getWearHistory);

export default router;
