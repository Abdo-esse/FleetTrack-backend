import * as authService from '../services/auth.js';

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    // Appel au service d'enregistrement
    const result = await authService.register(req.body);
    console.log('User registered:', result);

    res.status(201).json({
      user: result,
      message: 'User registered successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id, req.cookies.refreshToken);
    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }

    const { accessToken } = await authService.refresh(refreshToken);

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    next(error);
  }
};
