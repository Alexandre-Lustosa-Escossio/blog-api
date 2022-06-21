const { BlogPost } = require('../database/models');
const tokenHandler = require('../middlewares/tokenHandler');
const userService = require('./userService');

const addPost = async ({ body, headers }) => {
  const { authorization } = headers;
  const { data: userEmail } = tokenHandler.decodeToken(authorization);
  const { dataValues: { id } } = await userService.getUserByEmail(userEmail);
  const postPayload = { ...body, id };
  const postCategoryIds = postPayload.categoryIds;
  delete postPayload.categoryIds;
  const response = await BlogPost.create(postPayload);
  return response;
};

module.exports = {
  addPost,
};