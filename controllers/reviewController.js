const Review = require('./../models/reviewModel');
const factory = require('./../controllers/handlerFactory');
// const catchAsync = require('./../utils/catchAsync');

exports.getAllReviews = factory.getAll(Review);

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};

//   // Mutate variable
//   // Check if there is a tour id
//   if (req.params.tourId) filter = { tour: req.params.tourId };

//   // const reviews = await Review.find();
//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

// exports.createReview = catchAsync(async (req, res, next) => {
//   // Allow nested routes

//   // Note: If we didn't specify the tour id in the body
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   // Note: We get the req.user from the protect middleware
//   if (!req.body.user) req.body.user = req.user.id;

//   const newReview = await Review.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: newReview,
//     },
//   });
// });

exports.setTourUserIds = (req, res, next) => {
  // Note: If we didn't specify the tour id in the body
  if (!req.body.tour) req.body.tour = req.params.tourId;
  // Note: We get the req.user from the protect middleware
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

// exports.createReview = catchAsync(async (req, res, next) => {
//   // Allow nested routes

//   const newReview = await Review.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: newReview,
//     },
//   });
// });

exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
