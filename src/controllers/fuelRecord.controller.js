// src/controllers/fuelRecord.controller.js
import * as fuelService from '../services/fuelRecord.service.js';

export const createFuelRecord = async (req, res, next) => {
  try {
    const record = await fuelService.createFuelRecord(req.body);
    res.status(201).json({ record, message: 'Fuel record created successfully' });
  } catch (error) {
    next(error);
  }
};

export const getFuelRecords = async (req, res, next) => {
  try {
    const result = await fuelService.getAllFuelRecords(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getFuelRecord = async (req, res, next) => {
  try {
    const record = await fuelService.getFuelRecordById(req.params.id);
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

export const updateFuelRecord = async (req, res, next) => {
  try {
    const record = await fuelService.updateFuelRecord(req.params.id, req.body);
    res.status(200).json({ record, message: 'Fuel record updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteFuelRecord = async (req, res, next) => {
  try {
    await fuelService.deleteFuelRecord(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
