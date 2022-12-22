const { isCelebrateError } = require('celebrate');
const { serverErrorText, invalidInputText } = require('../constants');

module.exports.errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (isCelebrateError(err)) res.status(400).send({ message: invalidInputText });
  else res.status(statusCode).send({ message: statusCode === 500 ? serverErrorText : message });
  next();
};