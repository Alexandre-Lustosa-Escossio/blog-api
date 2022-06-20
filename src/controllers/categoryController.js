const categoryService = require('../services/categoryService');

const addCategory = async (req, res, next) => {
  try {
    const response = await categoryService.addCategory(req.body);
    return res.status(201).json(response);
  } catch (e) {
    next(e);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const response = await categoryService.findAll({ attributes: { exclude: ['password'] } });
    return response;
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addCategory,
  getAllCategories,
};