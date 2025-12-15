import mongoose from 'mongoose';

const maintenanceAlertSchema = new mongoose.Schema(
  {
    ruleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceRule',
      required: true,
    },

    targetType: {
      type: String,
      enum: ['Truck', 'Trailer', 'Tire'],
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    reason: {
      type: String, // dueByKm | dueByTime | dueByWear
      required: true,
    },

    details: Object,

    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active',
    },

    triggeredAt: {
      type: Date,
      default: Date.now,
    },

    resolvedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('MaintenanceAlert', maintenanceAlertSchema);
