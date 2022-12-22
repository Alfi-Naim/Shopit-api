const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET, devJwt } = require('../config');
const { authorizationErrorText } = require('../constants');

const handleAuthError = (res) => {
  res.status(401).send({ message: authorizationErrorText });
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : devJwt);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;
  return next();
};