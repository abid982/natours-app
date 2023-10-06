const mongoose = require('mongoose');
const validator = require('validator');

// const validateEmail = function (email) {
//   var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//   return regex.test(email);
// };

// Create a schema and then create model out of that schema
// Create a schema with five fields name, email, photo, password, confirmPassword
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Please provide your email',
    // validate: [validateEmail, 'Please provide your email'],
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  // If the user wants to upload a photo then that will be stored somewhere in our file system and the path to that photo will then be stored into this photo field.
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
});

// Create model out of schema
const User = mongoose.model('User', userSchema);

module.exports = User;
