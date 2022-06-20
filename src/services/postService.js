const { BlogPost } = require('../database/models');

const addPost = async (body) => {
  console.log(body);
  const response = await BlogPost.create(body);
  return response;
};

module.exports = {
  addPost,
};