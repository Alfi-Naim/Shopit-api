const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 30,
    required: true,
  },
  sortBy: {
    type: String,
    enum: ['Name Ascending', 'Name Descending', 'Time Added Ascending', 'Time Added Descending', 'Category'],
    default: 'Time Added Descending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  items: [{
    name: {
      type: String,
      minlength: 1,
      maxlength: 30,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    category: {
      type: Number,
      default: 0,
    },
    checked: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
});

module.exports = mongoose.model('list', listSchema);