const createPostValidator = (req, res, next) => {
  const { title, content, categoryIds } = req.body;
  if (!title || !content || !categoryIds) {
    const e = new Error('Some required fields are missing');
    e.status = 400;
    throw e;
  }
  if (categoryIds.length === 0) {
    const e = new Error('"categoryIds" not found');
    e.status = 400;
    throw e;
  }

  next();
};

module.exports = {
  createPostValidator,
};