const { User } = require('../database/models');
const tokenHandler = require('../middlewares/tokenHandler');
const errMsgs = require('../helpers/errorMessages.json');

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

const getUser = async (id) => {
  const response = await User.findOne({ where: { id }, attributes: { exclude: ['password'] } });
  if (!response) {
    const e = new Error(errMsgs.userDoesntExist);
    e.status = 404;
    throw e;
  }
  return response;
};

const getUserByEmail = async (email) => {
  const response = await User.findOne({ where: { email }, attributes: { exclude: ['password'] } });
  return response;
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  getUserByEmail,
};