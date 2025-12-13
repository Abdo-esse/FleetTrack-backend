import * as authService from '../../src/services/auth.js';
import User from '../../src/models/user.js';
import { hashPassword, comparePassword } from '../../src/utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../src/utils/jwt.js';

// Mock all dependencies
jest.mock('../../src/models/user.js');
jest.mock('../../src/utils/password.js');
jest.mock('../../src/utils/jwt.js');

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashed_password_123';
      const createdUser = {
        _id: 'user123',
        name: userData.name,
        email: userData.email,
        passwordHash: hashedPassword,
        role: 'Chauffeur',
      };

      hashPassword.mockResolvedValue(hashedPassword);
      User.create.mockResolvedValue(createdUser);

      const result = await authService.register(userData);

      expect(hashPassword).toHaveBeenCalledWith(userData.password);
      expect(User.create).toHaveBeenCalledWith({
        name: userData.name,
        email: userData.email,
        passwordHash: hashedPassword,
      });

      expect(result).toEqual({
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
      });
    });

    it('should throw error when User.create fails (duplicate email)', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123',
      };

      hashPassword.mockResolvedValue('hashed');
      User.create.mockRejectedValue(new Error('E11000 duplicate key error'));

      await expect(authService.register(userData)).rejects.toThrow('E11000 duplicate key error');
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'password123',
      };

      const mockUser = {
        _id: 'user123',
        email: loginData.email,
        passwordHash: 'hashed_password',
        role: 'Admin',
        refreshTokens: [],
        save: jest.fn().mockResolvedValue(true),
      };

      const mockTokens = {
        user: {
          id: mockUser._id,
          email: mockUser.email,
          role: mockUser.role,
        },
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      comparePassword.mockResolvedValue(true);
      generateAccessToken.mockReturnValue(mockTokens.accessToken);
      generateRefreshToken.mockReturnValue(mockTokens.refreshToken);

      const result = await authService.login(loginData);

      expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
      expect(comparePassword).toHaveBeenCalledWith(loginData.password, mockUser.passwordHash);
      expect(generateAccessToken).toHaveBeenCalledWith({
        id: mockUser._id,
        role: mockUser.role,
      });
      expect(generateRefreshToken).toHaveBeenCalledWith({
        id: mockUser._id,
      });
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(loginData.email);
    });

    it('should throw error for invalid email', async () => {
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(
        authService.login({ email: 'nonexistent@example.com', password: 'password123' })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for invalid password', async () => {
      const mockUser = {
        _id: 'user123',
        email: 'user@example.com',
        passwordHash: 'hashed_password',
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      comparePassword.mockResolvedValue(false);

      await expect(
        authService.login({ email: 'user@example.com', password: 'wrongpassword' })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('refresh', () => {
    it('should generate new access token with valid refresh token', async () => {
      const refreshToken = 'valid_refresh_token';
      const decoded = { id: 'user123' };
      const mockUser = {
        _id: 'user123',
        email: 'user@example.com',
        role: 'Chauffeur',
        refreshTokens: [{ token: refreshToken, expiresAt: new Date(Date.now() + 1000000) }],
      };
      const newAccessToken = 'new_access_token';

      verifyRefreshToken.mockReturnValue(decoded);
      User.findById.mockResolvedValue(mockUser);
      generateAccessToken.mockReturnValue(newAccessToken);

      const result = await authService.refresh(refreshToken);

      expect(verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(User.findById).toHaveBeenCalledWith(decoded.id);
      expect(generateAccessToken).toHaveBeenCalledWith({
        id: mockUser._id,
        role: mockUser.role,
      });
      expect(result).toEqual({ accessToken: newAccessToken });
    });

    it('should throw error if refresh token is missing', async () => {
      await expect(authService.refresh(null)).rejects.toThrow('Refresh token required');
      await expect(authService.refresh(undefined)).rejects.toThrow('Refresh token required');
    });

    it('should throw error if refresh token is invalid', async () => {
      const refreshToken = 'invalid_token';
      const decoded = { id: 'user123' };
      const mockUser = {
        _id: 'user123',
        refreshTokens: [{ token: 'different_token', expiresAt: new Date() }],
      };

      verifyRefreshToken.mockReturnValue(decoded);
      User.findById.mockResolvedValue(mockUser);

      await expect(authService.refresh(refreshToken)).rejects.toThrow('Invalid refresh token');
    });

    it('should throw error if user not found', async () => {
      const refreshToken = 'valid_token';
      const decoded = { id: 'nonexistent_user' };

      verifyRefreshToken.mockReturnValue(decoded);
      User.findById.mockResolvedValue(null);

      await expect(authService.refresh(refreshToken)).rejects.toThrow('User not found');
    });
  });

  describe('logout', () => {
    it('should remove refresh token from user', async () => {
      const userId = 'user123';
      const refreshToken = 'refresh_token_to_remove';

      User.findByIdAndUpdate.mockResolvedValue({});

      await authService.logout(userId, refreshToken);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, {
        $pull: { refreshTokens: { token: refreshToken } },
      });
    });

    it('should handle logout even if token does not exist', async () => {
      const userId = 'user123';
      const refreshToken = 'nonexistent_token';

      User.findByIdAndUpdate.mockResolvedValue({});

      await expect(authService.logout(userId, refreshToken)).resolves.not.toThrow();
      expect(User.findByIdAndUpdate).toHaveBeenCalled();
    });
  });
});
