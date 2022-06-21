const { Op } = require('sequelize');
const { BlogPost, User, Category } = require('../database/models');
const postCategoryService = require('./postCategoryService');
const errMsgs = require('../helpers/errorMessages.json');
const { decodeToken } = require('../middlewares/tokenHandler');
const userService = require('./userService');

const eagerLoading = [
    {
      model: User,
      as: 'user',
      attributes: { exclude: ['password'] },
    },
    {
      model: Category,
      as: 'categories',
    },
  ];

const getUserIdFromToken = async (token) => {
  const { data: userEmail } = decodeToken(token);
  const { dataValues: { id } } = await userService.getUserByEmail(userEmail);
  return id;
};

const returnPostIfExists = async (id) => {
  const post = await BlogPost.findOne({ where: { id } });
  if (!post) {
    const e = new Error('Post does not exist');
    e.status = 404;
    throw e;
  }
  return post;
};

const checkIfUserIsAuthor = async (post, userId) => {
  const isUserAuthor = post.userId === userId;
  if (!isUserAuthor) {
    const e = new Error('Unauthorized user');
    e.status = 401;
    return e;
  }
};

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
  const id = await getUserIdFromToken(authorization);
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

const getAllPosts = async () => {
  const response = await BlogPost.findAll({
    include: eagerLoading,
  });
  return response;
};

const getPost = async (id) => {
  const response = await BlogPost.findOne({
    where: { id },
    include: eagerLoading,
  });
  if (!response) {
    const e = new Error(errMsgs.postDoesntExist);
    e.status = 404;
    throw e;
  }
  return response; 
};

const updatePost = async ({ body, params: { id }, headers: { authorization } }) => {
  const { title, content } = body;
  const userId = await getUserIdFromToken(authorization);
  const post = await returnPostIfExists(id);
  // caso o post já esteja atualizado, retornará unauthorized user
  const isNotTheAuthor = await checkIfUserIsAuthor(post, userId);
  if (isNotTheAuthor) {
    throw isNotTheAuthor;
  }
  await BlogPost.update({ title, content }, { where: { id, userId } });
  const response = await getPost(id);
  return response;
};

const deletePost = async ({ headers: { authorization }, params: { id } }) => {
  const userId = await getUserIdFromToken(authorization);
  const post = await returnPostIfExists(id);
  const isNotTheAuthor = await checkIfUserIsAuthor(post, userId);
  if (isNotTheAuthor) {
    throw isNotTheAuthor;
  }
  const response = await BlogPost.destroy({ where: { id, userId } });
  return response;
};

const getPostsByKeyword = async (queryParam) => {
  if (!queryParam) {
    const response = await getAllPosts();
    return response;
  }
  const response = await BlogPost.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: `%${queryParam}%` } },
        { content: { [Op.like]: `%${queryParam}%` } },
      ] },
    include: eagerLoading,
  });
  return response;
};

module.exports = {
  addPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  getPostsByKeyword,
};