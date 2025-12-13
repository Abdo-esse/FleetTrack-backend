import mongoose from 'mongoose';

const truckSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
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
      required: true,
      min: 0,
      default: 0,
    },

    status: {
      type: String,
      enum: ['available', 'maintenance', 'unavailable'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Truck', truckSchema);
