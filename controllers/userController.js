const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');

// Rest parameters
const filterObj = (obj, ...allowedFields) => {
  console.log('Allowed fields:');
  console.log(allowedFields);

  // Loop through the object and for each element check if it's one of the allowed fields and if it's simply add it to the new object that we then return at the end.

  //  Object.keys({ name: 'Abid', age: 25 });
  // The Object.keys will return the array of the field names of the object
  // ['name', 'age']
  const newObj = {};

  // If allowed fields arrays includes the current element of the array then add to the new object
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

exports.getAllUsers = factory.getAll(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword route',
        400,
      ),
    );

  // 2) Update user document
  // Get user and update properties and then by the end save the document but the problem with that is that some fields are required which we're not updating and because of that we will get some error.
  // const user = await User.findById(req.user.id);
  // user.name = 'Jonas';

  // await user.save();
  // Error --> "message": "Please confirm your password",
  // Note: The save method is not the correct option in this case. Instead what we can do now is to actually use findByIdAndUpdate because validators the are not going to run. We could not use it before for all the reasons for security measures or validation but sice we are no longer dealing with passwords but only with non-sensitive data like name or email we can now use findByIdAndUpdate.

  // Pass the user id and updated data with some options

  // Note: We do not want to update everything in the body because let's say the user put in a body the role for example
  // body.role: 'admin'
  // The user can also change the reset token and the reset token expiry date
  // We need to make sure that the object that we pass only contains name and email so basically we will filter the body so at the end it only contains the name and email and nothing else.

  // Create a variable
  // Pass body from the request object and the properties that we want to update
  // 2) Filtered out unwanted fields names that are not allowed to be updated.
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update use document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    // Return new object so basically the updated object instead of the old one and also run validators set to true because we want mongoose to validate our document. For example, if we put an invalid email address that should be caught by the validator and return an error.
    new: true,
    runValidators: true,
  });

  // Send back response
  // Send back the updated user
  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // Pass the data that we want to update
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// exports.getUser = (req, res) => {
//   // 500 error code means internal server error
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };

exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
  // 500 error code means internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use /signup instead',
  });
};

// exports.updateUser = (req, res) => {
//   // 500 error code means internal server error
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);

// exports.deleteUser = (req, res) => {
//   // 500 error code means internal server error
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };

exports.deleteUser = factory.deleteOne(User);
