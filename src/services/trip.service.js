// src/services/trip.service.js
import Trip from '../models/trip.js';
import Truck from '../models/truck.js';

import { calculateConsumption } from './fuelRecord.service.js';
import { checkTruckMaintenance } from './maintenance.service.js';
import { triggerAlert } from './maintenanceAlert.service.js';

export const createTrip = async (data) => {
  return Trip.create(data);
};

export const assignDriver = async (tripId, driverId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) throw new Error('Trip not found');

  if (trip.driverId) {
    throw new Error('Trip already assigned to a driver');
  }

  trip.driverId = driverId;
  return trip.save();
};

export const updateTripStatus = async (tripId, data, user) => {
  const trip = await Trip.findById(tripId);
  if (!trip) throw new Error('Trip not found');

  // Chauffeur ne peut modifier que SON trajet
  if (user.role === 'Chauffeur') {
    if (!trip.driverId || trip.driverId.toString() !== user.id) {
      throw new Error('Unauthorized to update this trip');
    }
  }

  trip.status = data.status;

  if (data.status === 'completed') {
    trip.endDate = data.endDate || new Date();
  }

  return trip.save();
};

export const getAllTrips = async (query) => {
  const { page = 1, limit = 10, status, driverId, truckId, sort = 'createdAt:desc' } = query;

  const pageNumber = Math.max(parseInt(page, 10), 1);
  const limitNumber = Math.max(parseInt(limit, 10), 1);
  const skip = (pageNumber - 1) * limitNumber;

  const filters = {};
  if (status) filters.status = status;
  if (driverId) filters.driverId = driverId;
  if (truckId) filters.truckId = truckId;

  const [sortField, sortOrder] = sort.split(':');
  const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

  const [trips, total] = await Promise.all([
    Trip.find(filters)
      .populate('truckId', 'registrationNumber')
      .populate('trailerId', 'registrationNumber')
      .populate('driverId', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber),
    Trip.countDocuments(filters),
  ]);

  return {
    data: trips,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
    filtersApplied: { status, driverId, truckId, sort },
  };
};

export const getTripById = async (id) => {
  const trip = await Trip.findById(id)
    .populate('truckId', 'registrationNumber')
    .populate('trailerId', 'registrationNumber')
    .populate('driverId', 'name email');

  if (!trip) throw new Error('Trip not found');
  return trip;
};

export const deleteTrip = async (id) => {
  const trip = await Trip.findByIdAndDelete(id);
  if (!trip) throw new Error('Trip not found');
};

export const completeTrip = async (tripId, data) => {
  const trip = await Trip.findById(tripId);
  if (!trip) throw new Error('Trip not found');

  if (data.arrivalMileage <= trip.departureMileage) {
    throw new Error('Arrival mileage must be greater than departure mileage');
  }

  const distanceKm = data.arrivalMileage - trip.departureMileage;

  trip.arrivalMileage = data.arrivalMileage;
  trip.distanceKm = distanceKm;
  trip.status = 'completed';

  await trip.save();

  /* Mise à jour automatique camion */
  await Truck.findByIdAndUpdate(trip.truckId, {
    mileage: data.arrivalMileage,
  });

  const truck = await Truck.findById(trip.truckId);

  /* 🔔 Vérification maintenance camion */
  const alerts = await checkTruckMaintenance(truck);

  for (const alert of alerts) {
    await triggerAlert({
      ruleId: alert.ruleId,
      targetType: 'Truck',
      targetId: truck._id,
      reason: alert.dueByKm ? 'dueByKm' : 'dueByTime',
      details: alert,
    });
  }

  await calculateConsumption(trip._id);

  return trip;
};
