const { BlogPost, User, Category, PostCategory } = require('../database/models');
const tokenHandler = require('../middlewares/tokenHandler');
const postCategoryService = require('./postCategoryService');
const userService = require('./userService');
const errMsgs = require('../helpers/errorMessages.json');

const getUserIdFromToken = async (token) => {
  const { data: userEmail } = tokenHandler.decodeToken(token);
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
    include: [
      {
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] },
      },
      {
        model: Category,
        as: 'categories',
      },
    ],
  });
  return response;
};

const getPost = async (id) => {
  const response = await BlogPost.findOne({
    where: { id },
    include: [
      { model: User,
        as: 'user',
        attributes: { exclude: ['password'] } },
      { model: Category,
        as: 'categories' },
    ],
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
  checkIfUserIsAuthor(post, userId);
  await BlogPost.update({ title, content }, { where: { id, userId } });
  const response = await getPost(id);
  return response;
};

const deletePost = async ({ headers: { authorization }, params: { id } }) => {
  const userId = await getUserIdFromToken(authorization);
  const post = await returnPostIfExists(id);
  const isNotTheAuthor = await checkIfUserIsAuthor(post, userId);
  console.log(isNotTheAuthor);
  if (isNotTheAuthor) {
    throw isNotTheAuthor;
  }
  const response = await Promise.all([
    PostCategory.destroy({ where: { postId: id } }),
    BlogPost.destroy({ where: { id, userId } }),
  ]);
  return response;
};

module.exports = {
  addPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
};