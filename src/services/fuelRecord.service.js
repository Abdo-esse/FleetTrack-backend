// src/services/fuelRecord.service.js
import FuelRecord from '../models/fuelRecord.js';
import Trip from '../models/trip.js';

export const createFuelRecord = async (data) => {
  return FuelRecord.create(data);
};

export const getAllFuelRecords = async (query) => {
  const { page = 1, limit = 10, truckId, driverId, startDate, endDate, sort = 'date:desc' } = query;

  const pageNumber = Math.max(parseInt(page, 10), 1);
  const limitNumber = Math.max(parseInt(limit, 10), 1);
  const skip = (pageNumber - 1) * limitNumber;

  const filters = {};

  if (truckId) filters.truckId = truckId;
  if (driverId) filters.driverId = driverId;

  if (startDate || endDate) {
    filters.date = {};
    if (startDate) filters.date.$gte = new Date(startDate);
    if (endDate) filters.date.$lte = new Date(endDate);
  }

  const [sortField, sortOrder] = sort.split(':');
  const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

  const [records, total] = await Promise.all([
    FuelRecord.find(filters)
      .populate('truckId', 'registrationNumber')
      .populate('driverId', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber),
    FuelRecord.countDocuments(filters),
  ]);

  return {
    data: records,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
    filtersApplied: {
      truckId,
      driverId,
      startDate,
      endDate,
      sort,
    },
  };
};

export const getFuelRecordById = async (id) => {
  const record = await FuelRecord.findById(id)
    .populate('truckId', 'registrationNumber')
    .populate('driverId', 'name email');

  if (!record) throw new Error('Fuel record not found');
  return record;
};

export const updateFuelRecord = async (id, data) => {
  const record = await FuelRecord.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!record) throw new Error('Fuel record not found');
  return record;
};

export const deleteFuelRecord = async (id) => {
  const record = await FuelRecord.findByIdAndDelete(id);
  if (!record) throw new Error('Fuel record not found');
};

export const calculateConsumption = async (tripId) => {
  const trip = await Trip.findById(tripId);
  if (!trip || !trip.distanceKm) return;

  const fuelRecords = await FuelRecord.find({ tripId });

  const totalLiters = fuelRecords.reduce((sum, record) => sum + record.liters, 0);

  const consumption = (totalLiters / trip.distanceKm) * 100;

  trip.fuelConsumedLiters = totalLiters;
  trip.consumptionLPer100Km = Number(consumption.toFixed(2));

  await trip.save();
};
