import User from '../models/user.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

const REFRESH_TTL = 7 * 24 * 60 * 60 * 1000;

export const register = async (data) => {
  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash: await hashPassword(data.password),
  });

  return {
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new Error('Invalid credentials');
  }

  return createTokens(user);
};

export const refresh = async (refreshToken) => {
  if (!refreshToken) throw new Error('Refresh token required');

  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findById(decoded.id);
  if (!user) throw new Error('User not found');

  const tokenExists = user.refreshTokens.some((t) => t.token === refreshToken);
  if (!tokenExists) throw new Error('Invalid refresh token');

  return {
    accessToken: generateAccessToken({
      id: user._id,
      role: user.role,
    }),
  };
};

export const logout = async (userId, refreshToken) => {
  await User.findByIdAndUpdate(userId, {
    $pull: { refreshTokens: { token: refreshToken } },
  });
};

const createTokens = async (user) => {
  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user._id,
  });

  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TTL),
  });

  await user.save();

  return {
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};
