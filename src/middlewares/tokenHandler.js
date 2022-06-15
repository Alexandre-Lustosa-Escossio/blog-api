const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const secret = 'senhaMuitoSegura';
  const jwtConfig = {
    expiresIn: '7d',
    algorithm: 'HS256',
  };
  
  const token = jwt.sign({ data: user }, secret, jwtConfig);
  
  return token;
};

module.exports = {
  generateToken,
};
