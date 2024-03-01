const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get all the tour data from collection
  const tours = await Tour.find();

  console.log('Tours:');
  console.log(tours);

  // Pass all tours data into the template so that we can actually use and display it on the website.

  // 2) Build template based on data

  // 3) Render the template using tour data from 1)
  // res.status(200).render('overview', {
  //   title: 'All Tours',
  // });
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  console.log('Tour:');
  console.log(tour);

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }

  // 2) Build template based on data

  // 3) Render template using the data from step 1)
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login your account',
  });
});
