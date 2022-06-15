const jwt = require('jsonwebtoken');
const { User } = require('../database/models');
const errorMsgs = require('../helpers/errorMessages.json');

require('dotenv/config');

const secret = process.env.JWT_SECRET;
const generateToken = (user) => {
  const jwtConfig = {
    expiresIn: '7d',
    algorithm: 'HS256',
  };
  
  const token = jwt.sign({ data: user }, secret, jwtConfig);
  
  return token;
};

const isThereToken = (req) => {
  const token = req.headers.authorization;
  if (!token) {
    const e = new Error(errorMsgs.tokenNotFound);
    e.status = 500;
    throw e;
  }
  return token;
};

const validateToken = async (req, _res, next) => {
  try {
    const token = isThereToken(req);    
    jwt.verify(token, secret);
    /* const user = await User.findOne({ where: { email: decoded.data } });
    if (!user) {
      const e = new Error(errorMsgs.expiredOrInvalidToken);
      e.status = 401;
      throw e;
    } */
  } catch (e) {
    e.message = errorMsgs.expiredOrInvalidToken;
    e.status = 401;
    next(e);
  }
  next();
};

module.exports = {
  generateToken,
  validateToken,
};
