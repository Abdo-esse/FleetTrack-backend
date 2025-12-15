// src/controllers/maintenance.controller.js
import * as maintenanceService from '../services/maintenance.service.js';
import Truck from '../models/truck.js';
import Tire from '../models/tire.js';
import Trailer from '../models/trailer.js';
import MaintenanceRecord from '../models/maintenanceRecord.js';

/* ================= ALERTS ================= */

export const getMaintenanceAlerts = async (req, res, next) => {
  try {
    const result = await maintenanceService.getMaintenanceAlerts(req.query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTruckAlerts = async (req, res, next) => {
  try {
    const truck = await Truck.findById(req.params.id);
    if (!truck) throw new Error('Truck not found');

    const alerts = await maintenanceService.checkTruckMaintenance(truck);
    res.status(200).json({ alerts });
  } catch (error) {
    next(error);
  }
};

export const getTireAlerts = async (req, res, next) => {
  try {
    const tire = await Tire.findById(req.params.id);
    if (!tire) throw new Error('Tire not found');

    const alerts = await maintenanceService.checkTireMaintenance(tire);
    res.status(200).json({ alerts });
  } catch (error) {
    next(error);
  }
};

export const getTrailerAlerts = async (req, res, next) => {
  try {
    const trailer = await Trailer.findById(req.params.id);
    if (!trailer) throw new Error('Trailer not found');

    const alerts = await maintenanceService.checkTrailerMaintenance(trailer);
    res.status(200).json({ alerts });
  } catch (error) {
    next(error);
  }
};

/* ================= RECORDS ================= */

export const getMaintenanceRecords = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, targetType, ruleId, search } = req.query;

    const filters = {};

    if (targetType) filters.targetType = targetType;
    if (ruleId) filters.ruleId = ruleId;

    if (search) {
      filters.notes = { $regex: search, $options: 'i' };
    }

    const pageNumber = Math.max(parseInt(page), 1);
    const limitNumber = Math.max(parseInt(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const [records, total] = await Promise.all([
      MaintenanceRecord.find(filters)
        .sort({ performedAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .populate('ruleId'),
      MaintenanceRecord.countDocuments(filters),
    ]);

    res.status(200).json({
      data: records,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createMaintenanceRecord = async (req, res, next) => {
  try {
    const record = await maintenanceService.createMaintenanceRecord(req.body);

    res.status(201).json({
      record,
      message: 'Maintenance record created successfully',
    });
  } catch (error) {
    next(error);
  }
};
