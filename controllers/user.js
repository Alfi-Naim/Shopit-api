const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NODE_ENV, JWT_SECRET, devJwt } = require('../config');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const UnauthorizedError = require('../errors/unauthorizedError');
const ConflictError = require('../errors/conflictError');

const {
  noUserFoundText, badRequestText, userCreatedText, userExistsText, wrongEmailOrPasswordText,
} = require('../constants');

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(noUserFoundText);
      }
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const userId = req.user._id;
  const name = req.body.name;
  const image = req.body.image;
  console.log(userId);
  User.findByIdAndUpdate(userId, { $set: { "name": name, "avatar": image } }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(noUserFoundText);
      }
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.register = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      if (!user) {
        throw new BadRequestError(badRequestText);
      }
      res.status(200).send({ message: userCreatedText });
    })
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        throw new ConflictError(userExistsText);
      }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new BadRequestError(badRequestText);
      }
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : devJwt, { expiresIn: '7d' }),
      });
    })
    .catch(() => {
      next(new UnauthorizedError(wrongEmailOrPasswordText));
    });
};