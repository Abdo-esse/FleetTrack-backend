import express from 'express';

import { getMissionOrderPdf } from '../controllers/missionOrder.controller.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/trips/:tripId/mission-order', authorize('Admin'), getMissionOrderPdf);

export default router;
