const { User } = require('../database/models');
const tokenHandler = require('../middlewares/tokenHandler');

const createUser = async (body) => {
    const response = await User.create(body);
    const { email } = response;
    const token = tokenHandler.generateToken(email);
    return { token };
};

const getAllUsers = async () => {
  const response = await User.findAll({ attributes: { exclude: ['password'] } });
  return response;
};

module.exports = {
  createUser,
  getAllUsers,
};