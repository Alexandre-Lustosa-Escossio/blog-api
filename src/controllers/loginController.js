const loginService = require('../services/loginService');

const requestLogin = async (req, res, next) => {
  try {
    const response = await loginService.requestLogin(req.body);
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = { 
  requestLogin,
};