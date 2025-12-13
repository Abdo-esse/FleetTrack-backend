import jwt from 'jsonwebtoken';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } =
  process.env;
export const generateAccessToken = (payload) =>
  jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY || '15m',
  });

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY || '7d',
  });

export const verifyAccessToken = (token) => jwt.verify(token, ACCESS_TOKEN_SECRET);
export const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_TOKEN_SECRET);
