const listsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
    getLists, getList, createList, updateList, deleteList, addItem, updateItem, removeItem, checkItem
} = require('../controllers/list');

listsRouter.get('/lists', getLists);

listsRouter.get('/lists/:listId', celebrate({
    params: Joi.object().keys({
        listId: Joi.string().hex().length(24),
    }),
}), getList);

listsRouter.post('/lists', celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(1).max(30),
    }),
}), createList);

listsRouter.delete('/lists/:listId', celebrate({
    params: Joi.object().keys({
        listId: Joi.string().hex().length(24),
    }),
}), deleteList);

listsRouter.put('/lists/:listId', celebrate({
    params: Joi.object().keys({
        listId: Joi.string().hex().length(24),
    }),
    body: Joi.object().keys({
        name: Joi.string().required().min(1).max(30),
        sortBy: Joi.string().default('Time Added Descending').valid('Name Ascending', 'Name Descending', 'Time Added Ascending', 'Time Added Descending', 'Category',),
    }),
}), updateList);

listsRouter.post('/lists/:listId/items', celebrate({
    params: Joi.object().keys({
        listId: Joi.string().hex().length(24),
    }),
    body: Joi.object().keys({
        name: Joi.string().required().min(1).max(30),
    }),
}), addItem);

listsRouter.put('/lists/:listId/items', celebrate({
    params: Joi.object().keys({
        listId: Joi.string().hex().length(24),
    }),
    body: Joi.object().keys({
        itemId: Joi.string().hex().length(24),
        name: Joi.string().required().min(1).max(30),
        quantity: Joi.number().default(1),
        category: Joi.number().default(0),
        checked: Joi.boolean().default(false),
        lastName: Joi.string(),
    }),
}), updateItem);

listsRouter.put('/lists/:listId/items/check', celebrate({
    params: Joi.object().keys({
        listId: Joi.string().hex().length(24),
    }),
    body: Joi.object().keys({
        itemId: Joi.string().hex().length(24),
        checked: Joi.boolean().default(false),
    }),
}), checkItem);

listsRouter.delete('/lists/:listId/items', celebrate({
    params: Joi.object().keys({
        listId: Joi.string().hex().length(24),
    }),
    body: Joi.object().keys({
        itemId: Joi.string().hex().length(24),
    }),
}), removeItem);

module.exports = listsRouter;