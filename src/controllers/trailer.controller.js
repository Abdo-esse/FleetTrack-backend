// src/controllers/trailer.controller.js
import * as trailerService from '../services/trailer.service.js';

export const createTrailer = async (req, res, next) => {
  try {
    const trailer = await trailerService.createTrailer(req.body);
    res.status(201).json({ trailer, message: 'Trailer created successfully' });
  } catch (error) {
    next(error);
  }
};

export const getTrailers = async (req, res, next) => {
  try {
    const result = await trailerService.getAllTrailers(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTrailer = async (req, res, next) => {
  try {
    const trailer = await trailerService.getTrailerById(req.params.id);
    res.status(200).json(trailer);
  } catch (error) {
    next(error);
  }
};

export const updateTrailer = async (req, res, next) => {
  try {
    const trailer = await trailerService.updateTrailer(req.params.id, req.body);
    res.status(200).json({ trailer, message: 'Trailer updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteTrailer = async (req, res, next) => {
  try {
    await trailerService.deleteTrailer(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
