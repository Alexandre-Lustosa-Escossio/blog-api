const isemail = require('isemail');
const errorMsgs = require('../helpers/errorMessages.json');

const validateDisplayName = (req, _res, next) => {
  const { displayName } = req.body;
  if (!displayName || displayName.length < 8) {
    const err = new Error(errorMsgs.invalidDisplayName);
    err.status = 400;
    throw err;
  }
  next();
};

const validateEmail = (req, _res, next) => {
  const { email } = req.body;
  const isEmailValid = isemail.validate(email);
  if (!email || !isEmailValid) {
    const err = new Error(errorMsgs.invalidEmail);
    err.status = 400;
    throw err;
  }
  next();
};

const validatePassword = (req, _res, next) => {
  const { password } = req.body;
  if (!password || password.length < 6) {
    const err = new Error(errorMsgs.invalidPassword);
    err.status = 400;
    throw err;
  }
  next();
};

module.exports = {
  validateDisplayName,
  validateEmail,
  validatePassword,
};