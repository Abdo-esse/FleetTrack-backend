import express from 'express';

import authRoutes from './auth.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the FleetTrack API' });
});
router.use('/auth', authRoutes);

export default router;
