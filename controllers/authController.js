// const util = require('util');
const { promisify } = require('util');
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
  console.log(req.body);
  // Create new document based on model
  // const newUser = await User.create(req.body);

  // For security reasons
  // If a new user try to input to manually input a role we will not store that into the new user.
  // We can no longer register as an admin and so if we need to add a new administrator to our system we can then very simply create a new user normally and then go into the mongodb compass and basically added that role in there of course we could create a new route.
  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  //   passowrdChangedAt: req.body.passwordChangedAt,
  // });

  // const newUser = await User.create(req.body);

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  console.log('New user...');
  console.log(newUser);

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

// Function to protect route
exports.protect = catchAsync(async (req, res, next) => {
  // Lining out a couple of steps

  let token;

  // 1) Get token and check if it's exist
  // A common practice is to send a token using an http header with the request so let's take a look at how we can set headers in postman to send them along with a request and then also how we can get acess to these headers in express.

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // const token = req.headers.authorization.split(' ')[1];
    // Note: let and const are block scoped
    token = req.headers.authorization.split(' ')[1];

    // console.log('Real token:');
    // console.log(token);
  }

  // If there is no token then the user not logged in and create an error
  // The status code 401 means unauthorized
  if (!token) {
    return next(
      new AppError(
        'You are not logged in! Please log in to get access...',
        401,
      ),
    );
  }

  // 2) Verify token
  // Validate token
  // The jwt algorithm verifies if the signature is valid or if it's not
  // In this step we verify that someone manipulate the data or also if the token has already expired.
  // So we already use the jwt web token package the sign function and now we're gonna use the verify function
  // Pass token in verify function so that the algorithm can read the payload and this step also needs the secret so basically in order to create the test signature.
  // The third argument is a callback function and this callback function run as soon as the verification has been completed.
  // The verify() function is an asynchronous function so it will verify the token and after that when it's done it will call the function that we can specify.
  // We're actually promisifying this function so basically to make it return a promise right and so in that way we can then use async await just like any other async function that we have been using and for that node actually has a built in promisify function.
  // Require built in util module or package and on that we can use the promisify method
  // We actually promisfy the function await promisify(jwt.verify) and call the function (token, process.env.JWT_SECRET) and it will return a promise and store the result into a variable. The resolved value of the promise is actually a decoded data or decoded payload from this JSON WEB TOKEN and the decoded payload should be the user id.
  // jwt.verify(token, process.env.JWT_SECRET, )
  /*
  {
    "status": "error",
    "error": {
        "name": "TokenExpiredError",
        "message": "jwt expired",
        "expiredAt": "2023-10-08T15:11:03.000Z",
        "statusCode": 500,
        "status": "error"
    },
    "message": "jwt expired",
    "stack": "TokenExpiredError: jwt expired\n    at /Users/abid/Documents/Node.js, Express, MongoDB & More The Complete Bootcamp 2023/natours-app/node_modules/jsonwebtoken/verify.js:190:21\n    at getSecret (/Users/abid/Documents/Node.js, Express, MongoDB & More The Complete Bootcamp 2023/natours-app/node_modules/jsonwebtoken/verify.js:97:14)\n    at module.exports (/Users/abid/Documents/Node.js, Express, MongoDB & More The Complete Bootcamp 2023/natours-app/node_modules/jsonwebtoken/verify.js:101:10)\n    at node:internal/util:375:7\n    at new Promise (<anonymous>)\n    at node:internal/util:361:12\n    at /Users/abid/Documents/Node.js, Express, MongoDB & More The Complete Bootcamp 2023/natours-app/controllers/authController.js:177:46\n    at /Users/abid/Documents/Node.js, Express, MongoDB & More The Complete Bootcamp 2023/natours-app/utils/catchAsync.js:12:3\n    at Layer.handle [as handle_request] (/Users/abid/Documents/Node.js, Express, MongoDB & More The Complete Bootcamp 2023/natours-app/node_modules/express/lib/router/layer.js:95:5)\n    at next (/Users/abid/Documents/Node.js, Express, MongoDB & More The Complete Bootcamp 2023/natours-app/node_modules/express/lib/router/route.js:144:13)"
}
  */
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // console.log('Decoded data:');
  // console.log(decoded);

  // Let's try to access the application with already expired token
  // Change token expiration time let's say 5s

  // Handle this JSONWEBTOKENERROR
  // Solution: try catch block but instead use global error handling middleware
  /*
  {
    "status": "error",
    "error": {
        "name": "JsonWebTokenError",
        "message": "invalid signature",
        "statusCode": 500,
        "status": "error"
    },
    "message": "invalid signature"
  */

  // The token is only for 5s
  /*
    {
    "status": "error",
    "error": {
        "name": "TokenExpiredError",
        "message": "jwt expired",
        "expiredAt": "2023-10-16T10:20:28.000Z",
        "statusCode": 500,
        "status": "error"
    },
    "message": "jwt expired"
    }
  */

  /*
  { id: '652d08bbddfbc8a1b4959be6', iat: 1697450171, exp: 1697536571 }
  */

  // Let's actually try to manipulate the payload of this token
  // https://jwt.io/
  // Change payload
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MmQwOGJiZGRmYmM4YTFiNDk1OWJhNyIsImlhdCI6MTY5NzQ1MDE3MSwiZXhwIjoxNjk3NTM2NTcxfQ.3qdaWBMXzBEvj1mGBFnae46Hpuvs4LH36nB8My77zyg

  // If the verification was actually successful then we also need to check if the user who's trying to access the route still exist
  // If the user has been deleted in the meantime so the token will exist but if the user is no longer existent well then we actually don't want to log him in right or even worse what if the user has actually changed his password after the token has been issued. In that case the old stolen token should no longer be valid so it should not be accepted to access protected routes.
  // 3) Check if user still exists
  // Id in payload and query user with id
  const currentUser = await User.findById(decoded.id);

  console.log('Current user:');
  console.log(currentUser);

  if (!currentUser)
    return next(
      new AppError(
        'The user belonging to this token does no longer exist',
        401,
      ),
    );

  // 4) Check if user changed password after the jwt or token was issued
  // To implement this test we will actually create another instance method so basically a method that is going to be available on all the documents and we do this because it's a quite a lot of code that we need for this verification.

  // Call an instance method on the user document
  // issued at
  // console.log('issued at:');
  // currentUser.changedPasswordAfter(decoded.iat);

  // If the password was actually changed well in this case we actually want an error
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed the password. Please login again',
        401,
      ),
    );
  }

  // Put the entire user data on the request
  req.user = currentUser;

  // So only if there was no problems in any of these steps here only then of course next will be called which will then get access to the route that we protected so in our current example getAllTours handler.

  // GRANT ACCESS TO THE PROTECTED ROUTE
  next();
});

// How are we actually going to implement this because usually we cannot pass arguments into a middleware function right butin this case we really want to. We want to pass in the roles who are allowed to access the resource right so in thiscase the admin and the lead guide. We need a way of basically passing in arguments into the middleware function in a way that usually doesn't work so how are we going to do that. Well in here we will actually create like a wrapper function which will then return a middleware function that we actually want to create.
// We want to pass an arbitrary number of arguments and so we can use the rest parameter syntax and this will then create an array of all the arguments that were specified.
// We are creating this function and right away we will the return a new function and this is the middleware function itself.
// This function will then basically get access to this roles parameter because there is a closure.
// 403 forbidden

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles ['admin', 'lead-guide'], role='user'

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };

// 404 error not found
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) next(new AppError('There is no user with email address', 404));

  // // 2) Generate the random reset token
  // // To create a random token we're actually going to create an instance method on the User becuase this really has to do with the user data itself.
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email

  res.status(200).json({
    resetToken,
  });

  next();
});

exports.resetPassword = async (req, res, next) => {
  res.status(200).json({
    success: true,
  });

  next();
};
