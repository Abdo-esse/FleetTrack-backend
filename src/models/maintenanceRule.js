// src/models/maintenanceRule.js
import mongoose from 'mongoose';

const maintenanceRuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Vidange moteur
    targetType: {
      type: String,
      enum: ['Truck', 'Trailer', 'Tire'],
      required: true,
    },

    intervalKm: {
      type: Number,
      min: 0,
    },

    intervalDays: {
      type: Number,
      min: 0,
    },

    wearThreshold: {
      type: Number, // % usure
      min: 0,
      max: 100,
    },

    description: String,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('MaintenanceRule', maintenanceRuleSchema);
