const { BlogPost } = require('../database/models');
const tokenHandler = require('../middlewares/tokenHandler');
const postCategoryService = require('./postCategoryService');
const userService = require('./userService');

const addPostCategories = async (categoryIds, postId) => {
  try {
    await Promise.all(
      categoryIds.map((categoryId) => postCategoryService.addPostCategory({ categoryId, postId })),
    );
  } catch (e) {
    return e;
  }
}; 

const addPost = async ({ body, headers }) => {
  // Refac this function to fulfill SOLID principles
  const { authorization } = headers;
  const { data: userEmail } = tokenHandler.decodeToken(authorization);
  const { dataValues: { id } } = await userService.getUserByEmail(userEmail);
  const postPayload = { ...body, userId: id };
  const postCategoryIds = postPayload.categoryIds;
  delete postPayload.categoryIds;
  const createBlogPostRes = await BlogPost.create(postPayload);
  const didRequestFail = await addPostCategories(postCategoryIds, createBlogPostRes.id);
  if (didRequestFail) {
    const e = new Error('"categoryIds" not found');
    e.status = 400;
    throw e;    
  }
  return createBlogPostRes;
};

module.exports = {
  addPost,
};