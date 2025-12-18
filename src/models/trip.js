// src/models/trip.js
import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    origin: { type: String, required: true },
    destination: { type: String, required: true },

    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Truck',
      required: true,
    },

    trailerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trailer',
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    status: {
      type: String,
      enum: ['planned', 'in_progress', 'completed'],
      default: 'planned',
    },

    departureMileage: {
      type: Number,
      required: true,
      min: 0,
    },

    arrivalMileage: {
      type: Number,
      min: 0,
    },

    distanceKm: {
      type: Number,
      min: 0,
    },

    fuelConsumedLiters: {
      type: Number,
      min: 0,
    },

    consumptionLPer100Km: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Trip', tripSchema);
