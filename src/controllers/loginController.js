const requestLogin = (req, res) => {
  const token = 'abc';
  return res.status(200).json(token);
};

module.exports = { 
  requestLogin,
};