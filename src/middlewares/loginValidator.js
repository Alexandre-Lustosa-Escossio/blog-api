const errorMsgs = require('../helpers/errorMessages.json');

const loginValidator = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const err = new Error(errorMsgs.missingFields);
    err.status = 400;
    throw err;
  }
  next();
};

module.exports = {
  loginValidator,
};