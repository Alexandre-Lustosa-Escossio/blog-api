const { Category } = require('../database/models');

const addCategory = (body) => {
  const response = Category.create(body);
  return response;
};

module.exports = {
  addCategory,
};