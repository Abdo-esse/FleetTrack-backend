// src/services/maintenanceRule.service.js
import MaintenanceRule from '../models/maintenanceRule.js';

export const createRule = async (data) => {
  return MaintenanceRule.create(data);
};

export const getAllRules = async (query) => {
  const { page = 1, limit = 10, targetType, isActive, search } = query;

  const pageNumber = Math.max(parseInt(page, 10), 1);
  const limitNumber = Math.max(parseInt(limit, 10), 1);
  const skip = (pageNumber - 1) * limitNumber;

  const filters = {};

  if (targetType) {
    filters.targetType = targetType;
  }

  if (isActive !== undefined) {
    filters.isActive = isActive === 'true';
  }

  if (search) {
    filters.name = { $regex: search, $options: 'i' };
  }

  const [rules, total] = await Promise.all([
    MaintenanceRule.find(filters).skip(skip).limit(limitNumber).sort({ createdAt: -1 }),
    MaintenanceRule.countDocuments(filters),
  ]);

  return {
    data: rules,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
    filtersApplied: { targetType, isActive, search },
  };
};

export const getRuleById = async (id) => {
  const rule = await MaintenanceRule.findById(id);
  if (!rule) {
    throw new Error('Maintenance rule not found');
  }
  return rule;
};

export const updateRule = async (id, data) => {
  const rule = await MaintenanceRule.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!rule) {
    throw new Error('Maintenance rule not found');
  }

  return rule;
};

export const deleteRule = async (id) => {
  const rule = await MaintenanceRule.findByIdAndDelete(id);
  if (!rule) {
    throw new Error('Maintenance rule not found');
  }
};
