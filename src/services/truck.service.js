// src/services/truck.service.js
import Truck from '../models/truck.js';

export const createTruck = async (data) => {
  const existingTruck = await Truck.findOne({
    registrationNumber: data.registrationNumber,
  });

  if (existingTruck) {
    throw new Error('Truck already exists');
  }

  return Truck.create(data);
};

export const getAllTrucks = async (query) => {
  const { page = 1, limit = 10, status, brand, search, sort = 'createdAt:desc' } = query;

  /* Pagination */
  const pageNumber = Math.max(parseInt(page, 10), 1);
  const limitNumber = Math.max(parseInt(limit, 10), 1);
  const skip = (pageNumber - 1) * limitNumber;

  /* Filtres */
  const filters = {};

  if (status) {
    filters.status = status;
  }

  if (brand) {
    filters.brand = brand;
  }

  if (search) {
    filters.registrationNumber = {
      $regex: search,
      $options: 'i',
    };
  }

  /* Tri */
  const [sortField, sortOrder] = sort.split(':');
  const sortOptions = {
    [sortField]: sortOrder === 'asc' ? 1 : -1,
  };

  /* Query */
  const [trucks, total] = await Promise.all([
    Truck.find(filters).sort(sortOptions).skip(skip).limit(limitNumber),
    Truck.countDocuments(filters),
  ]);

  return {
    data: trucks,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
    filtersApplied: {
      status,
      brand,
      search,
      sort,
    },
  };
};

export const getTruckById = async (id) => {
  const truck = await Truck.findById(id);
  if (!truck) {
    throw new Error('Truck not found');
  }
  return truck;
};

export const updateTruck = async (id, data) => {
  const truck = await Truck.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!truck) {
    throw new Error('Truck not found');
  }

  return truck;
};

export const deleteTruck = async (id) => {
  const truck = await Truck.findByIdAndDelete(id);
  if (!truck) {
    throw new Error('Truck not found');
  }
};
