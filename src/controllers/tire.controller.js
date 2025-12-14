// src/controllers/tire.controller.js
import * as tireService from '../services/tire.service.js';

export const createTire = async (req, res, next) => {
  try {
    const tire = await tireService.createTire(req.body);
    res.status(201).json({ tire, message: 'Tire created successfully' });
  } catch (error) {
    next(error);
  }
};

export const getTires = async (req, res, next) => {
  try {
    const result = await tireService.getAllTires(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTire = async (req, res, next) => {
  try {
    const tire = await tireService.getTireById(req.params.id);
    res.status(200).json(tire);
  } catch (error) {
    next(error);
  }
};

export const updateTire = async (req, res, next) => {
  try {
    const tire = await tireService.updateTire(req.params.id, req.body);
    res.status(200).json({ tire, message: 'Tire updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteTire = async (req, res, next) => {
  try {
    await tireService.deleteTire(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const assignTire = async (req, res, next) => {
  try {
    const tire = await tireService.assignTire(req.params.id, req.body);
    res.status(200).json({ tire, message: 'Tire assigned successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateWear = async (req, res, next) => {
  try {
    const tire = await tireService.updateWear(req.params.id, req.body, req.user.id);
    res.status(200).json({ tire, message: 'Wear level updated' });
  } catch (error) {
    next(error);
  }
};

export const getWearHistory = async (req, res, next) => {
  try {
    const history = await tireService.getWearHistory(req.params.id);
    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};
