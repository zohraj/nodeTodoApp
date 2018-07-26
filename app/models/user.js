const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const { check, validationResult } = require('express-validator/check');
var UserSchema = new mongoose.Schema({

  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
});
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, false, false, function (err, hash) {
    user.password = hash;
    console.log(user.password);
    next();
  });
});

var User = mongoose.model('User', UserSchema);
module.exports = User;