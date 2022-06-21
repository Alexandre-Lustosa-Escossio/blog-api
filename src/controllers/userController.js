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

const getAllUsers = async (_req, res, next) => {
  try {
    const response = await userService.getAllUsers();
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await userService.getUser(id);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const response = await userService.deleteUser(req);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  deleteUser,
};