const postService = require('../services/postService');

const addPost = async (req, res, next) => {
  try {
    const response = await postService.addPost(req);
    return res.status(201).json(response);
  } catch (e) {
    next(e);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const response = await postService.getAllPosts();
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addPost,
  getAllPosts,
};