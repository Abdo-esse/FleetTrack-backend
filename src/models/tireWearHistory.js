// src/models/tireWearHistory.js
import mongoose from 'mongoose';

const tireWearHistorySchema = new mongoose.Schema(
  {
    tireId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tire',
      required: true,
    },

    oldWearLevel: { type: Number, required: true },
    newWearLevel: { type: Number, required: true },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    note: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('TireWearHistory', tireWearHistorySchema);
