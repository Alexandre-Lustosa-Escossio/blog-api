const { Category } = require('../database/models');

const addCategory = async (body) => {
  // Remeber to validate if category already exists in the database
  const response = await Category.create(body);
  return response;
};

module.exports = {
  addCategory,
};