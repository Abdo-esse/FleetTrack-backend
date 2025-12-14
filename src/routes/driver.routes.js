// src/routes/driver.routes.js
import express from 'express';

import * as driverController from '../controllers/driver.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateDriverSchema } from '../validators/driver.validator.js';

const router = express.Router();

router.use(authenticate);

/* Admin uniquement */
router.get('/', authorize('Admin'), driverController.getDrivers);
router.get('/:id', authorize('Admin'), driverController.getDriverById);
router.put('/:id', authorize('Admin'), validate(updateDriverSchema), driverController.updateDriver);
router.delete('/:id', authorize('Admin'), driverController.deleteDriver);

/* Chauffeur connecté */
router.get('/me/profile', driverController.getMyProfile);

export default router;
