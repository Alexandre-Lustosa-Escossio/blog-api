const addCategory = (req, res, next) => {
  try {
    const response = categoryService.addCategory(req.body);
    return res.status(201).json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addCategory,
};