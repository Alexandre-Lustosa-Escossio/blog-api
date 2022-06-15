const { User } = require('../database/models');
const tokenHandler = require('../middlewares/tokenHandler');

const createUser = async (body) => {
    const response = await User.create(body);
    const { email } = response;
    const token = tokenHandler.generateToken(email);
    return { token };
};

module.exports = {
  createUser,
};