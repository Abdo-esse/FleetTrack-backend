import express from 'express';

import authRoutes from './auth.js';
import truckRoutes from './truck.routes.js';
import trailerRoutes from './trailer.routes.js';
import tireRoutes from './tire.routes.js';
import fuelRoutes from './fuelRecord.routes.js';
import tripRoutes from './trip.routes.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the FleetTrack API' });
});
router.use('/auth', authRoutes);
router.use('/trucks', truckRoutes);
router.use('/trailers', trailerRoutes);
router.use('/tires', tireRoutes);
router.use('/fuel', fuelRoutes);
router.use('/trips', tripRoutes);

export default router;
