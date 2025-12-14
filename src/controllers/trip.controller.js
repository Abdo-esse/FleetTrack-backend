// src/controllers/trip.controller.js
import * as tripService from '../services/trip.service.js';

export const createTrip = async (req, res, next) => {
  try {
    const trip = await tripService.createTrip(req.body);
    res.status(201).json({ trip, message: 'Trip created successfully' });
  } catch (error) {
    next(error);
  }
};

export const assignDriver = async (req, res, next) => {
  try {
    const trip = await tripService.assignDriver(req.params.id, req.body.driverId);
    res.status(200).json({ trip, message: 'Driver assigned successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateTripStatus = async (req, res, next) => {
  try {
    const trip = await tripService.updateTripStatus(req.params.id, req.body, req.user);
    res.status(200).json({ trip, message: 'Trip status updated' });
  } catch (error) {
    next(error);
  }
};

export const getTrips = async (req, res, next) => {
  try {
    const result = await tripService.getAllTrips(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTrip = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    await tripService.deleteTrip(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const completeTrip = async (req, res, next) => {
  try {
    const trip = await tripService.completeTrip(req.params.id, req.body);
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};
