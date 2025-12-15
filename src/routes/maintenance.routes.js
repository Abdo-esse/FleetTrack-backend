// src/routes/maintenance.routes.js
import express from 'express';

import * as maintenanceController from '../controllers/maintenance.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.use(authenticate);

/* ===== ALERTS ===== */
router.get('/alerts', authorize('Admin'), maintenanceController.getMaintenanceAlerts);

router.get('/alerts/trucks/:id', authorize('Admin'), maintenanceController.getTruckAlerts);

router.get('/alerts/tires/:id', authorize('Admin'), maintenanceController.getTireAlerts);

router.get('/alerts/trailers/:id', authorize('Admin'), maintenanceController.getTrailerAlerts);

/* ===== RECORDS ===== */
router.get('/records', authorize('Admin'), maintenanceController.getMaintenanceRecords);

router.post('/records', authorize('Admin'), maintenanceController.createMaintenanceRecord);

export default router;
