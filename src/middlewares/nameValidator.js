const nameValidator = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    const e = new Error('"name" is required');
    e.status = 400;
    throw e;
  }
  next();
};

module.exports = {
  nameValidator,
};