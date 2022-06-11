const errorHandler = (err, req, res, next) => {
  if (err) {
    return res.status(err.message.status || 500).json(err.message.message || 'Unexpected error'); 
  }
  next();
};

module.exports = {
  errorHandler,
};