// src/controllers/driver.controller.js
import * as driverService from '../services/driver.service.js';

export const getDrivers = async (req, res, next) => {
  try {
    const drivers = await driverService.getAllDrivers(req.query);
    res.status(200).json(drivers);
  } catch (error) {
    next(error);
  }
};

export const getDriverById = async (req, res, next) => {
  try {
    const driver = await driverService.getDriverById(req.params.id);
    res.status(200).json(driver);
  } catch (error) {
    next(error);
  }
};

export const updateDriver = async (req, res, next) => {
  try {
    const driver = await driverService.updateDriver(req.params.id, req.body);
    res.status(200).json({ driver, message: 'Driver updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteDriver = async (req, res, next) => {
  try {
    await driverService.deleteDriver(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};
