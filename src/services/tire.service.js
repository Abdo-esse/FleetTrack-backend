// src/services/tire.service.js
import Tire from '../models/tire.js';

export const createTire = async (data) => {
  return Tire.create(data);
};

export const getAllTires = async (query) => {
  const { page = 1, limit = 10, search, truckId, trailerId, sort = 'createdAt:desc' } = query;

  const pageNumber = Math.max(parseInt(page, 10), 1);
  const limitNumber = Math.max(parseInt(limit, 10), 1);
  const skip = (pageNumber - 1) * limitNumber;

  const filters = {};
  if (truckId) filters.truckId = truckId;
  if (trailerId) filters.trailerId = trailerId;
  if (search) filters.reference = { $regex: search, $options: 'i' };

  const [sortField, sortOrder] = sort.split(':');
  const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

  const [tires, total] = await Promise.all([
    Tire.find(filters).sort(sortOptions).skip(skip).limit(limitNumber),
    Tire.countDocuments(filters),
  ]);

  return {
    data: tires,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
    filtersApplied: {
      truckId,
      trailerId,
      search,
      sort,
    },
  };
};

export const getTireById = async (id) => {
  const tire = await Tire.findById(id);
  if (!tire) throw new Error('Tire not found');
  return tire;
};

export const updateTire = async (id, data) => {
  const tire = await Tire.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!tire) throw new Error('Tire not found');
  return tire;
};

export const deleteTire = async (id) => {
  const tire = await Tire.findByIdAndDelete(id);
  if (!tire) throw new Error('Tire not found');
};
