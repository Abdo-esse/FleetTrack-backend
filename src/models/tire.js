import mongoose from 'mongoose';

const tireSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      type: String,
      enum: [
        'avant gauche',
        'avant droit',
        'arrière gauche',
        'arrière droit',
        'centre gauche',
        'centre droit',
        'de secours',
      ],
      required: true,
    },

    wearLevel: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Truck',
      default: null,
    },

    trailerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trailer',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Validation métier :
 * Un pneu ne peut être attaché qu'à un camion OU une remorque
 */
tireSchema.pre('save', function (next) {
  if (this.truckId && this.trailerId) {
    return next(new Error('A tire cannot be assigned to both a truck and a trailer'));
  }
  next();
});

export default mongoose.model('Tire', tireSchema);
