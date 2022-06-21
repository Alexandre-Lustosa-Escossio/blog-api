const { BlogPost } = require('../database/models');
const tokenHandler = require('../middlewares/tokenHandler');
const postCategoryService = require('./postCategoryService');
const userService = require('./userService');

const addPost = async ({ body, headers }) => {
  const { authorization } = headers;
  const { data: userEmail } = tokenHandler.decodeToken(authorization);
  const { dataValues: { id } } = await userService.getUserByEmail(userEmail);
  const postPayload = { ...body, userId: id };
  const postCategoryIds = postPayload.categoryIds;
  delete postPayload.categoryIds;
  const createBlogPostResponse = await BlogPost.create(postPayload);
  await postCategoryIds.forEach((categoryId) => {
    postCategoryService.addPostCategory({ categoryId, postId: createBlogPostResponse.id });
    });
  return createBlogPostResponse;
};

module.exports = {
  addPost,
};