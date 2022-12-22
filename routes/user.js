const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getCurrentUser, login, register, updateUser } = require('../controllers/user');
const auth = require('../middlewares/auth');

usersRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

usersRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), register);

usersRouter.post('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    image: Joi.string(),
  }),
}), auth, updateUser);

usersRouter.get('/users/me', auth, getCurrentUser);

module.exports = usersRouter;