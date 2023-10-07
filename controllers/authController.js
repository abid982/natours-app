const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//
const signToken = payload =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

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

  // const token = jwt.sign(payload, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });

  const token = signToken(payload);

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

// 127.0.0.1:8000/api/v1/users/login
exports.login = catchAsync(async (req, res, next) => {
  // const email = req.body.email;
  // This is how the user is going to send in the login credentials for us to check and that check process has a couple of steps and so let's actually them them out here before we start coding.
  const { email, password } = req.body;

  console.log(email);
  console.log(password);

  // 1) Check if email and password exist then send error message to our client. Now how are we going to do that? Well we're going to do it using the tools that we implemented right in the last section so basically our AppError so we will simply create a new error message and our global error handling middleware will then pick it up and send that error back to the client. So let's actually start by importing that error.
  if (!email || !password) {
    // Call the next middleware and pass the error
    // The 400 error code for bad request
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Check if user exists && password is correct
  // Find user by email from database
  // const user = User.findOne({ email: email });

  // The select() method: Specifies which document fields to include or exclude (also known as the query "projection")
  // Explicitly select a couple of fields from the databse only the ones that we needed
  // Now in this case when we want a field that is by default not selected we need to use + and then the name of the field so by this it will be back in the output.

  const user = await User.findOne({ email: email }).select('+password');

  console.log('User');
  console.log(user);

  // Now it's time to compare the password that we have in the database with the one that the user just posted= but how we're gonna do that.
  // Solution: Use the bcrypt package to generate this hashed password. Since the hashed password which is in the database is encrypted. There is no way of getting back the old. So the solution is to encrypt the password which is posted and then compare with the original one.
  // Let's implement a function that's gonna do that and for that we'll use db encrypted package and we will do that in the User Model because this is really related to the data itself.

  // if (user.password === password)
  // Call instance method
  // const isValidPassword = await user.correctPassword(password, user.password);

  // if (!user || !isValidPassword) {
  if (!user || !(await user.correctPassword(password, user.password))) {
    // The status code 401 means unauthorized
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client

  // Testing
  // Create a fake token for now
  // Implement a route
  // const token = '';

  const payload = { id: user._id };

  const token = signToken(payload);

  console.log('Token sign in:');
  console.log(token);

  res.status(200).json({
    status: 'success',
    token,
  });
});
