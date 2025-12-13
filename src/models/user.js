import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  token: String,
  expiresAt: Date,
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['Admin', 'Chauffeur'], default: 'Chauffeur' },

    refreshTokens: [refreshTokenSchema],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
