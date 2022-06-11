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

module.exports = {
  validateDisplayName,
};