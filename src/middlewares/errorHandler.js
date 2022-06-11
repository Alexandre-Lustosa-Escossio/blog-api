const errorHandler = (err, req, res, next) => {
  if (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Unexpected error' }); 
  }
  next();
};

module.exports = {
  errorHandler,
};