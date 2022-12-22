const mainRouter = require('express').Router();
const auth = require('../middlewares/auth');

const usersRouter = require('./user');
const listRouter = require('./list');

mainRouter.use('/', usersRouter);
mainRouter.use('/', auth, listRouter);

module.exports = mainRouter;