const User = require('../database/models');

const requestLogin = async ({ email, password }) => {
  const response = await User.findOne({ where: { email, password } });
  if (!response) {
    throw Error({ status: 400, message: 'Invalid fields' });
  }
  return response;
};

module.exports = {
  requestLogin,
};