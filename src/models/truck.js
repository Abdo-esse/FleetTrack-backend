// src/models/truck.js
import mongoose from 'mongoose';

const truckSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    mileage: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['available', 'maintenance', 'unavailable'],
      default: 'available',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Truck', truckSchema);
