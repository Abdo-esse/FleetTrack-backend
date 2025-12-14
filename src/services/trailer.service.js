// src/services/trailer.service.js
import Trailer from '../models/trailer.js';

export const createTrailer = async (data) => {
  const existingTrailer = await Trailer.findOne({
    registrationNumber: data.registrationNumber,
  });

  if (existingTrailer) {
    throw new Error('Trailer already exists');
  }

  return Trailer.create(data);
};

export const getAllTrailers = async (query) => {
  const { page = 1, limit = 10, status, type, search, sort = 'createdAt:desc' } = query;

  const pageNumber = Math.max(parseInt(page, 10), 1);
  const limitNumber = Math.max(parseInt(limit, 10), 1);
  const skip = (pageNumber - 1) * limitNumber;

  const filters = {};

  if (status) filters.status = status;
  if (type) filters.type = type;
  if (search) {
    filters.registrationNumber = { $regex: search, $options: 'i' };
  }

  const [sortField, sortOrder] = sort.split(':');
  const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

  const [trailers, total] = await Promise.all([
    Trailer.find(filters).sort(sortOptions).skip(skip).limit(limitNumber),
    Trailer.countDocuments(filters),
  ]);

  return {
    data: trailers,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
    filtersApplied: { status, type, search, sort },
  };
};

export const getTrailerById = async (id) => {
  const trailer = await Trailer.findById(id);
  if (!trailer) throw new Error('Trailer not found');
  return trailer;
};

export const updateTrailer = async (id, data) => {
  const trailer = await Trailer.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!trailer) throw new Error('Trailer not found');
  return trailer;
};

export const deleteTrailer = async (id) => {
  const trailer = await Trailer.findByIdAndDelete(id);
  if (!trailer) throw new Error('Trailer not found');
};
