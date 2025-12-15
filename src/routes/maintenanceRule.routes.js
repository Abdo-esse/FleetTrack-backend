// src/routes/maintenanceRule.routes.js
import express from 'express';

import * as maintenanceRuleController from '../controllers/maintenanceRule.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createMaintenanceRuleSchema,
  updateMaintenanceRuleSchema,
} from '../validators/maintenanceRule.validator.js';

const router = express.Router();

router.use(authenticate);

// Admin uniquement
router.post(
  '/',
  authorize('Admin'),
  validate(createMaintenanceRuleSchema),
  maintenanceRuleController.createRule
);

// Pagination + filtres
// GET /api/maintenance-rules?targetType=Truck&isActive=true
router.get('/', maintenanceRuleController.getRules);

router.get('/:id', maintenanceRuleController.getRule);

router.put(
  '/:id',
  authorize('Admin'),
  validate(updateMaintenanceRuleSchema),
  maintenanceRuleController.updateRule
);

router.delete('/:id', authorize('Admin'), maintenanceRuleController.deleteRule);

export default router;
