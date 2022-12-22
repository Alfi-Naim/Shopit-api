const List = require('../models/list');
const Grocery = require('../models/grocery');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');
const ConflictError = require('../errors/conflictError');

module.exports.getLists = (req, res, next) => {
  const owner = req.user._id;
  List.find({ owner: owner }, { name: 1 })
    .then((lists) => res.status(200).send(lists))
    .catch(next);
};

module.exports.getList = (req, res, next) => {
  const owner = req.user._id;
  const listId = req.params.listId;
  List.findOne({ owner: owner, _id: listId })
    .then((list) => res.status(200).send(list))
    .catch(next);
};

module.exports.createList = (req, res, next) => {
  const owner = req.user._id;
  const name = req.body.name;
  List.create({ owner, name, })
    .then((list) => {
      if (!list) throw new ForbiddenError("invalid input");
      res.status(200).send(list);
    })
    .catch(next);
};

module.exports.deleteList = (req, res, next) => {
  const owner = req.user._id;
  const listId = req.params.listId;
  List.findOneAndDelete({ owner: owner, _id: listId })
    .then((list) => res.status(200).send(list))
    .catch(next);
};

module.exports.updateList = (req, res, next) => {
  const owner = req.user._id;
  const listId = req.params.listId;
  const listName = req.body.name;
  const sortBy = req.body.sortBy;
  List.findOneAndUpdate({ owner: owner, _id: listId }, { "name": listName, "sortBy": sortBy }, { new: true })
    .then((list) => {
      if (!list) throw new NotFoundError('list not found');
      res.status(200).send(list);
    })
    .catch((err) => {
      if (err.name === 'CastError') throw new BadRequestError('bad request');
      next(err);
    })
    .catch(next);
}

module.exports.addItem = (req, res, next) => {
  const owner = req.user._id;
  const listId = req.params.listId;
  const name = req.body.name;
  let category = 0;
  List.findOne({ owner: owner, _id: listId, "items.name": name })
  .collation({ "locale": "en", "strength": 2 })
    .then((list) => {
      if (list) throw new ConflictError(`Item with the name '${name}' already exists`);
      Grocery.findOne({ name: name })
        .collation({ "locale": "en", "strength": 2 })
        .then((res) => {
          if (res != null) category = res.category;
          else category = 0;
        })
        .finally(() => {
          List.findOneAndUpdate(
            { owner: owner, _id: listId },
            { $addToSet: { items: { name: name, category: category } } },
            { new: true })
            .collation({ "locale": "en", "strength": 2 })
            .then((list) => {
              if (!list) throw new NotFoundError('list not found');
              res.status(200).send(list);
            })
            .catch((err) => {
              if (err.name === 'CastError') throw new BadRequestError('bad request');
              next(err);
            })
            .catch(next);
        })
    })
    .catch((err) => {
      if (err.name === 'CastError') throw new BadRequestError('bad request');
      next(err);
    })
    .catch(next);
}

module.exports.updateItem = (req, res, next) => {
  const owner = req.user._id;
  const listId = req.params.listId;
  const { itemId, quantity, lastName } = req.body;
  const name = req.body.name;
  let category = req.body.category;
  List.find({ owner: owner, _id: listId, items: { $elemMatch: { _id: { $ne: itemId }, name: name } } })
    .collation({ "locale": "en", "strength": 2 })
    .then((list) => {
      if (list && list.length > 0) throw new ConflictError(`Item with the name '${name}' already exists`);
      else if (name === lastName || lastName === undefined) {
        List.findOneAndUpdate(
          { owner: owner, _id: listId },
          { $set: { "items.$[elem].quantity": quantity, "items.$[elem].category": category, }, },
          { new: true, arrayFilters: [{ "elem._id": itemId }] })
          .collation({ "locale": "en", "strength": 2 })
          .then((list) => {
              if (!list) throw new NotFoundError('list not found');
              res.status(200).send(list);
          })
          .catch((err) => {
            if (err.name === 'CastError') throw new BadRequestError('bad request');
            next(err);
          })
          .catch(next);
      }
      else {
        Grocery.findOne({ name: name })
          .collation({ "locale": "en", "strength": 2 })
          .then((res) => {
            if (res != null) category = res.category;
            else category = 0;
          })
          .finally(() => {
            List.findOneAndUpdate(
              { owner: owner, _id: listId },
              { $set: { "items.$[elem].quantity": quantity, "items.$[elem].name": name, "items.$[elem].category": category, }, },
              { new: true, arrayFilters: [{ "elem._id": itemId }] })
              .collation({ "locale": "en", "strength": 2 })
              .then((list) => {
                if (!list) throw new NotFoundError('list not found');
                res.status(200).send(list);
              })
              .catch((err) => {
                if (err.name === 'CastError') throw new BadRequestError('bad request');
                next(err);
              })
              .catch(next);
          })
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') throw new BadRequestError('bad request');
      next(err);
    });
}

module.exports.checkItem = (req, res, next) => {
  const owner = req.user._id;
  const listId = req.params.listId;
  const { itemId, checked } = req.body;

  List.findOneAndUpdate(
    { owner: owner, _id: listId },
    { $set: { "items.$[elem].checked": checked, }, },
    { new: true, arrayFilters: [{ "elem._id": itemId }] })
    .then((list) => {
      if (!list) throw new NotFoundError('list not found');
      res.status(200).send(list);
    })
    .catch((err) => {
      if (err.name === 'CastError') throw new BadRequestError('bad request');
      next(err);
    })
    .catch(next);
}

module.exports.removeItem = (req, res, next) => {
  const owner = req.user._id;
  const listId = req.params.listId;
  const itemId = req.body.itemId;

  List.findOneAndUpdate(
    { owner: owner, _id: listId }, { $pull: { items: { "_id": itemId } } }, { new: true })
    .then((list) => {
      if (!list) throw new NotFoundError('item not found');
      res.status(200).send(list);
    })
    .catch((err) => {
      if (err.name === 'CastError') throw new BadRequestError('Bad request');
      next(err);
    })
    .catch(next);
}