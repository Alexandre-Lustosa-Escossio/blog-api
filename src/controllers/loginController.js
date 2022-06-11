const loginService = require('../services/loginService');

const requestLogin = async (req, res) => {
  const response = await loginService.requestLogin(req.body);
  res.status(200).json(response);
};

module.exports = { 
  requestLogin,
};