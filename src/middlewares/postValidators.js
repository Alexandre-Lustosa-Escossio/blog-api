const titleValidator = (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    const e = new Error('Some required fields are missing');
    e.status = 400;
    throw e;
  }
  next();
};

const contentValidator = (req, res, next) => {
  const { content } = req.body;
  if (!content) {
    const e = new Error('Some required fields are missing');
    e.status = 400;
    throw e;
  }
  next();
};

const categoryIdValidator = (req, res, next) => {
  const { categoryIds } = req.body;
  if (!categoryIds || categoryIds.length === 0) {
    const e = new Error('Some required fields are missing');
    e.status = 400;
    throw e;
  }
  next();
};

const createPostValidator = [titleValidator, contentValidator, categoryIdValidator];
const updatePostValidator = [titleValidator, contentValidator];
 
module.exports = {
  createPostValidator,
  updatePostValidator,
};