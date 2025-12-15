// src/controllers/maintenanceRule.controller.js
import * as maintenanceRuleService from '../services/maintenanceRule.service.js';

export const createRule = async (req, res, next) => {
  try {
    const rule = await maintenanceRuleService.createRule(req.body);
    res.status(201).json({ rule, message: 'Maintenance rule created successfully' });
  } catch (error) {
    next(error);
  }
};

export const getRules = async (req, res, next) => {
  try {
    const result = await maintenanceRuleService.getAllRules(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getRule = async (req, res, next) => {
  try {
    const rule = await maintenanceRuleService.getRuleById(req.params.id);
    res.status(200).json(rule);
  } catch (error) {
    next(error);
  }
};

export const updateRule = async (req, res, next) => {
  try {
    const rule = await maintenanceRuleService.updateRule(req.params.id, req.body);
    res.status(200).json({ rule, message: 'Maintenance rule updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteRule = async (req, res, next) => {
  try {
    await maintenanceRuleService.deleteRule(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
