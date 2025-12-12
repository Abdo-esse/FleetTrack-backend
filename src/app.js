import 'express-async-errors';
import dotenv from 'dotenv';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

// === CORS configuration ===
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? 'http://localhost:5173'
      : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept',],
  exposedHeaders: ['set-cookie'],
};

// === Global middlewares ===
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(cors(corsOptions));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
// app.use(httpLogger);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// === Health Check ===
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// === 404 Handler ===
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// === Start Server ===
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('Initialisation du serveur CareFlow EHR...');
    app.listen(PORT, () => {
       console.log(`Serveur opérationnel sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Erreur critique au démarrage du serveur :', error);
    process.exit(1);
  }
};

startServer();

export default app;
