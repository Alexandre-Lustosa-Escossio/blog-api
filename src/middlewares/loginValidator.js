const errorMsgs = require('../helpers/errorMessages.json');

const loginValidator = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: errorMsgs.missingFields });
  }
  next();
};

module.exports = {
  loginValidator,
};