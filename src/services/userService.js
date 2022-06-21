const { User, BlogPost, PostCategory } = require('../database/models');
const { generateToken, decodeToken } = require('../middlewares/tokenHandler');
const errMsgs = require('../helpers/errorMessages.json');

const createUser = async (body) => {
    const response = await User.create(body);
    const { email } = response;
    console.log(generateToken);
    const token = generateToken(email);
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

const getUserByEmail = async (email, eagerLoading = false) => {
  if (eagerLoading) {
    const response = await User.findOne({
      where: { email },
      include: [
        { model: BlogPost, as: 'blogposts' },
        { model: PostCategory, as: 'postCategories' },
      ],
    });  
    return response;
  }
  const response = await User.findOne({ where: { email }, attributes: { exclude: ['password'] } });
  return response;
};

const deleteUser = async ({ headers: { authorization } }) => {
  const { data: email } = decodeToken(authorization);
  const { id: userId } = await getUserByEmail(email);
  const response = await User.destroy({ where: { id: userId } });
  return response;
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  getUserByEmail,
  deleteUser,
};