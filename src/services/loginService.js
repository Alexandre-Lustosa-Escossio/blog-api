const { User } = require('../database/models');
const errorMsgs = require('../helpers/errorMessages.json');

const requestLogin = async ({ email, password }) => {
  const response = await User.findOne({ where: { email, password } });
  if (!response) {
    // Source: https://stackoverflow.com/questions/35502432/passing-object-to-nodes-error-class-returns-an-unaccessible-object
    const err = new Error(errorMsgs.invalidFields);
    err.status = 400;
    throw err;
  }
  return response;
};

module.exports = {
  requestLogin,
};