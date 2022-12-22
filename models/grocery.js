const mongoose = require('mongoose');

const grocerySchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 30,
        unique: 1,
        required: true,
    },
    category: {
        type: Number,
        default: 0,
        required: true
    },
});

module.exports = mongoose.model('grocery', grocerySchema);