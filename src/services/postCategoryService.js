const { PostCategory } = require('../database/models');

const addPostCategory = async (payload) => {
  const response = PostCategory.create(payload);
  return response;
};

module.exports = {
  addPostCategory,
};