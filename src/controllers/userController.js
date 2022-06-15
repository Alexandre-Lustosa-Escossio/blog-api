const userService = require('../services/userService');
const errorMsgs = require('../helpers/errorMessages.json');

const createUser = async (req, res, next) => {
  try {
    const response = await userService.createUser(req.body);
    return res.status(201).json(response);
  } catch (e) {
    e.message = errorMsgs.userAlreadyRegistered;
    e.status = 409;
    next(e);
  }
};

const getUser = async (req, res, next) => {
  try {
    const response = await userService.getUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createUser,
  getUser,
};