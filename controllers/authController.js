const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

// Create and export our very first controller and that is signup
// Implement a route so that signup handler here then can get called.
exports.signup = catchAsync(async (req, res, next) => {
  console.log('Signup:');
  console.log(req);
  // Create new document based on model
  // const newUser = await User.create(req.body);

  // For security reasons
  // If a new user try to input to manually input a role we will not store that into the new user.
  // We can no longer register as an admin and so if we need to add a new administrator to our system we can then very simply create a new user normally and then go into the mongodb compass and basically added that role in there of course we could create a new route.
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // Logged the new user in as soon as he signed up
  // Sign a json web token then send it back to the user.
  // Install npm package jsonwebtoken

  // Create a new token we will use jwt.sign function
  // First option is payload and this is basically an object for all the data that we want to store inside of the token and in this case we really only want the id of the user so not a lot of data that's not really important.
  // Get the id of the user that was just created
  // Pass options
  // When JWT Expires

  // WE JUST CREATE A NEW TOKEN
  const payload = { id: newUser.id };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // For logging in user we will use jwt.verify function

  console.log('New user:');
  console.log(newUser);

  // SEND THE TOKEN TO THE USER THEN THE USER STORES IT SOMEWHERE ELSE

  // Send new user to the client
  res.status(201).json({
    status: 'success',
    token,
    // Envelope data
    data: {
      user: newUser,
    },
  });
});
