const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

// Create and export our very first controller and that is signup
// Implement a route so that signup handler here then can get called.
exports.signup = catchAsync(async (req, res, next) => {
  console.log('Signup:');
  console.log(req);
  // Create new document based on model
  const newUser = await User.create(req.body);

  console.log('New user:');
  console.log(newUser);

  // Send new user to the client
  res.status(201).json({
    status: 'success',
    // Envelope data
    data: {
      user: newUser,
    },
  });
});
