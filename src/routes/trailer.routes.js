// src/routes/trailer.routes.js
import express from 'express';

import * as trailerController from '../controllers/trailer.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.middleware.js';
import { createTrailerSchema, updateTrailerSchema } from '../validators/trailer.validator.js';

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  authorize('Admin'),
  validate(createTrailerSchema),
  trailerController.createTrailer
);

// Pagination + tri => GET /api/trailers?page=2&limit=5&sort=mileage:asc
// Recherche par matricule => GET /api/trailers?search=ABC
// Remorques disponibles => GET /api/trailers?status=available&type=Reefer
router.get('/', trailerController.getTrailers);

router.get('/:id', trailerController.getTrailer);

router.put(
  '/:id',
  authorize('Admin'),
  validate(updateTrailerSchema),
  trailerController.updateTrailer
);

router.delete('/:id', authorize('Admin'), trailerController.deleteTrailer);

export default router;
