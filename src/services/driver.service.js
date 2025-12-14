// src/services/driver.service.js
import User from '../models/user.js';

export const getAllDrivers = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [drivers, total] = await Promise.all([
    User.find({ role: 'Chauffeur' }).skip(skip).limit(limit),
    User.countDocuments({ role: 'Chauffeur' }),
  ]);

  return {
    data: drivers,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getDriverById = async (id) => {
  const driver = await User.findOne({ _id: id, role: 'Chauffeur' });
  if (!driver) throw new Error('Driver not found');
  return driver;
};

export const updateDriver = async (id, data) => {
  const driver = await User.findOneAndUpdate({ _id: id, role: 'Chauffeur' }, data, {
    new: true,
    runValidators: true,
  });

  if (!driver) throw new Error('Driver not found');
  return driver;
};

export const deleteDriver = async (id) => {
  const driver = await User.findOneAndDelete({ _id: id, role: 'Chauffeur' });
  if (!driver) throw new Error('Driver not found');
};
