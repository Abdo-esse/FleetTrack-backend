import * as authController from '../../src/controllers/auth.js';
import * as authService from '../../src/services/auth.js';

// Mock the auth service
jest.mock('../../src/services/auth.js');

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      cookies: {},
      user: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should set httpOnly cookie and return user with access token', async () => {
      const loginData = { email: 'user@example.com', password: 'password123' };
      const serviceResult = {
        user: { id: 'user123', email: loginData.email, role: 'Admin' },
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
      };

      req.body = loginData;
      authService.login.mockResolvedValue(serviceResult);

      await authController.login(req, res, next);

      expect(authService.login).toHaveBeenCalledWith(loginData);
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', serviceResult.refreshToken, {
        httpOnly: true,
        secure: false, // NODE_ENV is 'test' not 'production'
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      expect(res.json).toHaveBeenCalledWith({
        user: serviceResult.user,
        accessToken: serviceResult.accessToken,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Invalid credentials');
      req.body = { email: 'user@example.com', password: 'wrong' };
      authService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should return 201 status and created user', async () => {
      const registerData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      };
      const serviceResult = {
        name: registerData.name,
        email: registerData.email,
        role: 'Chauffeur',
      };

      req.body = registerData;
      authService.register.mockResolvedValue(serviceResult);

      // Mock console.log to avoid output during tests
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      await authController.register(req, res, next);

      expect(authService.register).toHaveBeenCalledWith(registerData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        user: serviceResult,
        message: 'User registered successfully',
      });
      expect(next).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Email already exists');
      req.body = { name: 'User', email: 'existing@example.com', password: 'password123' };
      authService.register.mockRejectedValue(error);

      await authController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear refresh token cookie and return 204', async () => {
      req.user = { id: 'user123', email: 'user@example.com', role: 'Admin' };
      req.cookies = { refreshToken: 'mock_refresh_token' };
      authService.logout.mockResolvedValue();

      await authController.logout(req, res, next);

      expect(authService.logout).toHaveBeenCalledWith(req.user.id, req.cookies.refreshToken);
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Logout failed');
      req.user = { id: 'user123' };
      req.cookies = { refreshToken: 'token' };
      authService.logout.mockRejectedValue(error);

      await authController.logout(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.clearCookie).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should return new access token', async () => {
      const refreshToken = 'valid_refresh_token';
      const newAccessToken = 'new_access_token';

      req.cookies = { refreshToken };
      authService.refresh.mockResolvedValue({ accessToken: newAccessToken });

      await authController.refresh(req, res, next);

      expect(authService.refresh).toHaveBeenCalledWith(refreshToken);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ accessToken: newAccessToken });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if refresh token is missing', async () => {
      req.cookies = {};

      await authController.refresh(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Refresh token missing' });
      expect(authService.refresh).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if cookies object is undefined', async () => {
      req.cookies = undefined;

      await authController.refresh(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Refresh token missing' });
    });

    it('should call next with error on service failure', async () => {
      const error = new Error('Invalid refresh token');
      req.cookies = { refreshToken: 'invalid_token' };
      authService.refresh.mockRejectedValue(error);

      await authController.refresh(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should return user profile from req.user', async () => {
      req.user = {
        id: 'user123',
        email: 'user@example.com',
        role: 'Chauffeur',
      };

      await authController.getProfile(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if an exception occurs', async () => {
      req.user = null; // This will cause an error when trying to access req.user.id

      await authController.getProfile(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });
});
