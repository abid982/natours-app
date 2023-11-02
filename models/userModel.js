const { randomBytes, createHash } = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const SALT = 10;

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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'administrator', 'admin'],
    // In order to allow only a certain type of roles to be spcified
    // These user roles are specific to applications domain for example if we want to run a commmunity site then it gonna not make much sense. You probably have moderators, contributors or members etc.
    // Different names depending upon type of application
    default: 'user', // Default is normal user if not specified role field
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // The validate property
    validate: {
      // Validator function which gets called as soon as a new document is created
      // Custom validator
      // Simply specify a callback function
      // This only works on CREATE & SAVE
      // Let's say we want to update the password with regular UPDATE then in that case this passwordConfirm validation error will not longer work.
      // This will only work when we CREATE a new object or on SAVE
      validator: function (el) {
        // The this points to
        // If returns false then there is a validation error
        return el === this.password;
      },
      // Create an error message
      message: 'Passwords are not the same',
    },
  },
  // This password changed property will always be changed of course when someone changed a password so right now we don't have that logic anywhere and so nowhere we are actually defining this property.
  passwordChangedAt: {
    type: Date,
    required: false,
  },
  passwordResetToken: String,
  // Note: The password reset token will actually expire after a certain amount of time as a security measure for example 10 minutes.
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    // We do not want to show this in the output. Hide implementation detail from the user
    select: false,
  },
});

// In fact we can also use User.save() in order to update the user

// Keep the fat model thin controller philosophy in mind
// Pasword encryption
// The pre save middleweare so the document middleware
// The middleware function we're gonna specify here so the encryption is then gonna be happened between the moment that we receive the data and the moment where it's actually persisted to the database so that's where the pre save middleware runs between getting the data and saving it to the database.
// We have to access the next function in order to call the next middleware
// WE HAVE IMPLEMENTED A VERY SECURE AND GOOD PASSWORD MANAGEMENT
userSchema.pre('save', async function (next) {
  console.log('User schema pre save middleware...');
  // Only run this function if password was actually modified.

  // We actually only want to encrypt the password if the password field has actually been updated when the password is changed or also when it's created new because image the user is updating the email then in that case of course we do not want to encrypt the password again.

  // The this keyword refers to the current document so in this case to the current user.
  const user = this;

  // Only hash the password if it has been modified (or is new)
  // So we have a method on all documents which we can if a certain field has been modified.
  // Pass name of the field
  // Return or exit the function and call the next middleware
  if (!user.isModified('password')) return next();

  // Hash(encrypt) the password
  // We will use well studied and very popular hashing algorithm called bcrypt. So this algorithm first salt and then hash password in order to make it really strong to protect it against brute force attacks alright. It's going to add a random string to the password so that two equal passwords do not generate the same hash.

  // Use bcryptjs package in order to use this algorithm.

  // The current password in the document
  // Specidy a cost parameter how CPU intensive this operation will be
  // So this hash here is an asynchronous function and it will then return a promise so we need to use await and say that this function is an async function
  this.password = await bcrypt.hash(this.password, SALT);

  // Delete the confirm password so not to be persisted in the database so after validation successfull we no longer need this field and password confirm is a required input not that is required to actually be persisted to the database.
  this.passwordConfirm = undefined;

  // We of course need to call the next middleware
  next();
});

// Now when do we actually want to set the passwordChangedAt property to right now? Well we only want it when we modified the password property.
userSchema.pre('save', function (next) {
  // If we didn't modify the password property then we not to manipulate the password change at. But what about creating new document. Well when we create a new document then we did actully modify the password and we set the password changed at property.
  // If the document is new
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// Query middleware
// We want to add this middleware function to apply to every query that starts with find for example findByIdAndUpdate & findByIdAndDelete.
// starts with find
userSchema.pre(/^find/, function (next) {
  // this points to current query
  // const users = await User.find();
  // We only want to find documents which have the active property set to true
  this.where({ active: { $ne: false } });

  next();
});

// Check if the given password is the same as the one that is stored in the document.
// Create an instance method so the instance method is basically a method that's gonna be available on all documents of collection
// This function accepts a candidate password so the password that the user passes in the body and then also the user password.
// Call this function in the authController.
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  // The this keyworkd points to the current document but in this case since we have password select to false so this.password will not be available.
  return await bcrypt.compare(candidatePassword, userPassword);
};

// In this function we will pass the jwt timestamp so basically the timestamp which says when the token was issued.
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  console.log('jwt password changed after:');
  // By default we will return false and that means the user has not changed his password after the token was issued.
  // In the instance method the this keyword always points to the current document and so therefore here we have access to the properties.
  console.log(this);
  console.log(this.passwordChangedAt);
  console.log(jwtTimestamp);
  // Now we actually need to create a field in our schema for that date where the password has been changed
  // Later in this section when we will implemnt the logic for chaning the password is when we will then set this property but now we will artificially basically set it here when we create a new user.
  // Create a user which has this property on it.
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    // console.log(jwtTimestamp, this.passwordChangedAt);
    console.log(changedTimestamp, jwtTimestamp);

    // Return our result
    // The date or the time at which the token was issued is less than changed timestamp
    return jwtTimestamp < changedTimestamp;
    // Example: Let's say the token was issued at 100 but we changed the password let's say at time 200 and so we changed the password after the token was issued and so therefore this is now true and that's exactly what we want to return here because false means not changed and true of course means changed.
  }

  // By default the user has never actually changed the password
  // False means NOT changed
  return false;
};

// Instance method to create password reset token
// The password reset token should basically be a random string but at the same time it doesn't need to be as cryptographically strong as the password hash.
// We can just use the very simple random bytes function from the built-in croypto node module
userSchema.methods.createPasswordResetToken = function () {
  // Generate token
  // This token is what we're going to send to the user so it's like a reset password really that the user can then use to create a new real password and of course only the user will have access to this token ans so in fact it really behaves kind of like a password ans so since essentially it is just a password it means if a hacker can get access to our database well that's gonna allow the hacker to gain access to the account by setting a new password so we should never store a plain reset token in the database ans so let's actually encrypt it. We're going to use the built-in crypto module.

  // Where we're going to save this reset token? Well we're going to create a new field in our database schema so that we can compare it with the token that the user provides.
  const resetToken = randomBytes(32).toString('hex');

  console.log('Reset token:');
  console.log(resetToken);

  // Save encrypted password reset token to the database
  this.passwordResetToken = createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // We just modified the data
  // When we set this dot passwordResetExpires for example we did in fact not really update the document we did not save it.
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // Then we also want to return the plain text token becuase that's actually the one that we're going to send through the email.

  // Testing
  console.log({ resetToken }, this.passwordResetToken);

  return resetToken;
};

// Create model out of schema
const User = mongoose.model('User', userSchema);

module.exports = User;
