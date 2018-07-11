var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var validator = require('validator');
mongoose.connect('mongodb://localhost:27017/custom');
var ItemSchema = new mongoose.Schema({

    title: {
        type: String,
        unique: true,
        // required: true,
        trim: true
    },
    description: {
        type: String,
        // required: true,
        trim: true
    }

});
ItemSchema.pre('save', function (next) {
    var item = this;
    console.log(item);

    if (!validator.isLength(item.title, 1, 50)) {
        return next(new Error('Title must be between 1 and 50 characters.'));
    }

    if (!validator.isLength(item.description, 5, 20)) {
        return next(new Error('Description must be between 5 and 20 characters.'));
    }


    next();
});

var Item = mongoose.model('items', ItemSchema);
module.exports = Item;