const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const { BlogPost, User, Category, PostCategory } = require('../database/models');
const postCategoryService = require('./postCategoryService');
const errMsgs = require('../helpers/errorMessages.json');
const { decodeToken } = require('../middlewares/tokenHandler');
const userService = require('./userService');

const config = require('../database/config/config');

const sequelize = new Sequelize(config.development);

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

const linkCatToPost = async (categoryIds, postId) => {
  const listOfCatsWithPostId = categoryIds.map((categoryId) => ({ categoryId, postId }
  ));
  return listOfCatsWithPostId;
}; 

const addPost = async ({ body, headers }) => {
  // Refac this function to fulfill SOLID principles
  const { authorization } = headers;
  const id = await getUserIdFromToken(authorization);
  const postPayload = { ...body, userId: id };
  const postCategories = linkCatToPost(postPayload.categoryIds, id);
  delete postPayload.categoryIds;
  const transaction = await sequelize.transaction();
  try {
    const createBlogPostRes = await BlogPost.create(postPayload, { transaction });
    await PostCategory.bulkCreate(postCategories, { transaction });
    await transaction.commit();
    return createBlogPostRes;
  } catch (e) {
    await transaction.rollback();
    e.message = '"categoryIds" not found';
    e.status = 400;
    throw e;    
  }
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