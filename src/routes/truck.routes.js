// src/routes/truck.routes.js
import express from 'express';

import * as truckController from '../controllers/truck.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.middleware.js';
import { createTruckSchema, updateTruckSchema } from '../validators/truck.validator.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('Admin'), validate(createTruckSchema), truckController.createTruck);

// Pagination + tri=>GET /api/trucks?page=2&limit=5&sort=mileage:asc
// Recherche par matricule=>GET /api/trucks?search=ABC
// Camions disponibles=> GET /api/trucks?status=available&brand=Volvo

router.get('/', truckController.getTrucks);

router.get('/:id', truckController.getTruck);

router.put('/:id', authorize('Admin'), validate(updateTruckSchema), truckController.updateTruck);

router.delete('/:id', authorize('Admin'), truckController.deleteTruck);

export default router;
