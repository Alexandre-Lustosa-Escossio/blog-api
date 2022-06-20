const postService = require('../services/postService');

const addPost = async (req, res, next) => {
  try {
    const response = await postService.addPost(req.body);
    return res.status(201).json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addPost,
};