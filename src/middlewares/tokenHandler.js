const jwt = require('jsonwebtoken');
require('dotenv/config');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;
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
