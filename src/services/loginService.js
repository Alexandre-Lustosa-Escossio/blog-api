const { User } = require('../database/models');
const errorMsgs = require('../helpers/errorMessages.json');

const requestLogin = async ({ email, password }) => {
  const response = await User.findOne({ where: { email, password } });
  if (!response) {
    // Source: https://stackoverflow.com/questions/35502432/passing-object-to-nodes-error-class-returns-an-unaccessible-object
    const err = new Error(errorMsgs.invalidFields);
    err.status = 400;
    throw err;
  }
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjo1LCJkaXNwbGF5TmFtZSI6InVzdWFyaW8gZGUgdGVzdGUiLCJlbWFpbCI6InRlc3RlQGVtYWlsLmNvbSIsImltYWdlIjoibnVsbCJ9LCJpYXQiOjE2MjAyNDQxODcsImV4cCI6MTYyMDY3NjE4N30.Roc4byj6mYakYqd9LTCozU1hd9k_Vw5IWKGL4hcCVG8';
  return { token };
};

module.exports = {
  requestLogin,
};