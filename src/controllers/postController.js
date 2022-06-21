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

const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await postService.getPost(id);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const response = await postService.updatePost(req);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await postService.deletePost(id);
    return res.status(204).json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
};