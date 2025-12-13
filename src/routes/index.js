import express from 'express';

import authRoutes from './auth.js';
import truckRoutes from './truck.routes.js';
import trailerRoutes from './trailer.routes.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the FleetTrack API' });
});
router.use('/auth', authRoutes);
router.use('/trucks', truckRoutes);
router.use('/trailers', trailerRoutes);

export default router;
