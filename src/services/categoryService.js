const { Category } = require('../database/models');

const addCategory = async (body) => {
  const response = await Category.create(body);
  return response;
};

module.exports = {
  addCategory,
};