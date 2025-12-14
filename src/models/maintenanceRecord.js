// src/models/maintenanceRecord.js
import mongoose from 'mongoose';

const maintenanceRecordSchema = new mongoose.Schema(
  {
    ruleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceRule',
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    targetType: {
      type: String,
      enum: ['Truck', 'Trailer', 'Tire'],
      required: true,
    },

    mileageAtService: Number,

    wearLevelAtService: Number,

    performedAt: {
      type: Date,
      default: Date.now,
    },

    cost: Number,

    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('MaintenanceRecord', maintenanceRecordSchema);
