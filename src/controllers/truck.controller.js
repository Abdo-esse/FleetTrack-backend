// src/controllers/truck.controller.js
import * as truckService from '../services/truck.service.js';

export const createTruck = async (req, res, next) => {
  try {
    const truck = await truckService.createTruck(req.body);
    res.status(201).json({ truck, message: 'Truck created successfully' });
  } catch (error) {
    next(error);
  }
};

export const getTrucks = async (req, res, next) => {
  try {
    const result = await truckService.getAllTrucks(req.query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTruck = async (req, res, next) => {
  try {
    const truck = await truckService.getTruckById(req.params.id);
    res.status(200).json(truck);
  } catch (error) {
    next(error);
  }
};

export const updateTruck = async (req, res, next) => {
  try {
    const truck = await truckService.updateTruck(req.params.id, req.body);
    res.status(200).json({ truck, message: 'Truck updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteTruck = async (req, res, next) => {
  try {
    await truckService.deleteTruck(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
