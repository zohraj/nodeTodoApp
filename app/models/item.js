const mongoose = require('mongoose')
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
    },

    createdBy:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }


});
ItemSchema.pre('save', function (next) {
    var item = this;

    next();
});

var Item = mongoose.model('Item', ItemSchema);
module.exports = Item;