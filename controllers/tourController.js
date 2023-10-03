// const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

// Read file
// So __dirname is the folder where the current script is located and so that is this main folder.
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));
// console.log(tours);

// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour is id: ${val}`);
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }

//     next();
// };

// exports.checkBody = (req, res, next) => {

//     console.log('Request in check body middleware handler:');
//     console.log(req.body);
//     // { name: 'Murree Tour', duration: 35, difficulty: 'medium' }

//     if (!req.body.name || !req.body.duration) {
//        return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         });
//     }

//     next();
// };

// Middleware function
exports.aliasTopTours = (req, res, next) => {
  // Manipulate query object
  // Set property values
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  console.log('Request query object in alias top tours:');
  console.log(req.query);

  next();
};

// 2) Route Handlers
exports.getAllTours = catchAsync(async (req, res, next) => {
  // Create a new object
  // Pass query and query string
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const features = new APIFeatures(Tour.find(), req.query)
  //   .filter()
  //   .sort()
  //   .limitFields()
  //   .paginate();

  console.log('Features instance:');
  console.log(features);
  // features.filter();
  // Chain methods
  // We are try to calling the sort() method on the result of this features.filter() and what is the result of this
  // features.filter().sort().limitFields().paginate();

  // const tours = await query;
  const tours = await features.query;

  // MAKING THE API BETTER ADVANCED FILTERING
  // { difficulty: 'easy', duration: 5 }
  // { duration: { gte: '5' }, difficulty: 'easy' }
  // { difficulty: 'easy', duration: { $gte: 5 } }
  // 127.0.01:8000/api/v1/tours?duration[gte]=5&difficulty=easy&page=2

  // Special mongoose methods
  // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
  console.log('All tours:');
  console.log(tours);

  // SEND RESPONSE
  // JSEND Data Specification
  res.status(200).json({
    status: 'success',
    // requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
});

// exports.getAllTours = async (req, res) => {
//   try {
//     // BUILD QUERY
//     // 1A) Filtering
//     // Problem
//     // const queryObj = req.query;
//     // Create a shallow copy of an object
//     // const queryObj = { ...req.query };
//     // const excludedFields = ['page', 'sort', 'limit', 'fields'];

//     // excludedFields.forEach((el) => delete queryObj[el]);

//     // console.log('Request query:');
//     // console.log(req.query, queryObj);
//     // // { duration: '5', difficulty: 'easy' }
//     // // 127.0.01:8000/api/v1/tours?duration=5&difficulty=easy&page=2

//     // // const tours = await Tour.find();
//     // // const tours = await Tour.find({
//     // //     duration: 5,
//     // //     difficulty: 'easy'
//     // // });

//     // // const tours = await Tour.find(req.query);
//     // // const tours = await Tour.find(queryObj);

//     // // 1B) Advanced filtering
//     // // gte, gt, lte, lt
//     // // Convert JavaScript Object to String
//     // let queryStr = JSON.stringify(queryObj);

//     // console.log('Query string before:');
//     // console.log(queryStr);
//     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//     // console.log('Query string after:');
//     // console.log(queryStr);

//     // EXECUTE QUERY
//     // const query = Tour.find(queryObj);
//     // let query = Tour.find(JSON.parse(queryStr));
//     // // query.sort().select().skip().limit()

//     // const testTour = await Tour.find({
//     //   name: 'The Wine Taster',
//     // });
//     // console.log('Test tour:');
//     // console.log(testTour);

//     // // 2) Sorting
//     // // 127.0.01:8000/api/v1/tours?sort=price
//     // // 127.0.01:8000/api/v1/tours?sort=-price
//     // if (req.query.sort) {
//     //   // Chain operations
//     //   // Sort query
//     //   // query = query.sort(req.query.sort);
//     //   // sort('price ratingsAverage');
//     //   // 127.0.01:8000/api/v1/tours?sort=price,-ratingsAverage

//     //   const sortBy = req.query.sort.split(',').join(' ');

//     //   console.log('Sort by:');
//     //   console.log(sortBy);
//     //   query = query.sort(sortBy);
//     // } else {
//     //   // Newest tour appears first
//     //   query = query.sort('-createdAt');
//     // }

//     // // 3) Limiting fields
//     // // 127.0.01:8000/api/v1/tours?fields=name,duraction,difficulty,price
//     // if (req.query.fields) {
//     //   console.log('Request query fields:');
//     //   console.log(req.query.fields);
//     //   // { fields: 'name,duraction,difficulty,price' }

//     //   const fields = req.query.fields.split(',').join(' ');
//     //   // Selecting only certain field names is called projecting.
//     //   // query = query.select('name duration price difficulty');
//     //   query = query.select(fields);
//     // } else {
//     //   // Default if user doesn't specify something
//     //   // Minus means excluding
//     //   query = query.select('-__v');
//     // }

//     // 4) Pagination
//     // page=2&limit=10
//     // query = query.skip(10).limit(10);
//     // Page 1 --> 1 - 10 Results
//     // Page 2 --> 11 - 20 Results
//     // Page 3 --> 21 - 30 Results
//     // limit: The amount of results that we want in the query
//     // skip(): The amount of results that should be skipped before actually querying data
//     // We need some way of calculating skip value so basically based on page and the limit
//     // Get the page and the limit from the query string and we should also define some default values because we still want to have pagination even if the user doen't specify any page or any limit because for example we have a million results in our database and then of course when the user does the request we would not simply show all of the ten million results.

//     // const page = req.query.page * 1 || 1;
//     // const limit = req.query.limit * 1 || 100;
//     // const skip = (page - 1) * limit;
//     // // query = query.skip(10).limit(10);
//     // query = query.skip(skip).limit(limit);

//     // if (req.query.page) {
//     //   const numTours = await Tour.countDocuments();

//     //   console.log('Number of tours in database:');
//     //   console.log(numTours);
//     //   console.log(skip);

//     //   if (skip >= numTours) throw new Error('This page does not exist');
//     // }

//     // Create a new object
//     // Pass query and query string
//     const features = new APIFeatures(Tour.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();
//     // const features = new APIFeatures(Tour.find(), req.query)
//     //   .filter()
//     //   .sort()
//     //   .limitFields()
//     //   .paginate();

//     console.log('Features instance:');
//     console.log(features);
//     // features.filter();
//     // Chain methods
//     // We are try to calling the sort() method on the result of this features.filter() and what is the result of this
//     // features.filter().sort().limitFields().paginate();

//     // const tours = await query;
//     const tours = await features.query;

//     // MAKING THE API BETTER ADVANCED FILTERING
//     // { difficulty: 'easy', duration: 5 }
//     // { duration: { gte: '5' }, difficulty: 'easy' }
//     // { difficulty: 'easy', duration: { $gte: 5 } }
//     // 127.0.01:8000/api/v1/tours?duration[gte]=5&difficulty=easy&page=2

//     // Special mongoose methods
//     // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
//     console.log('All tours:');
//     console.log(tours);

//     // SEND RESPONSE
//     // JSEND Data Specification
//     res.status(200).json({
//       status: 'success',
//       // requestedAt: req.requestTime,
//       results: tours.length,
//       data: {
//         tours,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
//   // Send back all the tours to the client
//   // success, fail(error at the client), error(error at the server)

//   // console.log(req.requestTime);
// };

exports.getTour = catchAsync(async (req, res, next) => {
  // const tour = await Tour.findById({ _id: req.params.id });
  const tour = await Tour.findById(req.params.id);
  // Tour.findOne({ _id: req.params.id });

  // If there is no tour then call next with an error so in order to jump straight into our error handling middleware
  // Immediatedly return because we don't want to move on to the next line
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// exports.getTour = async (req, res) => {
//   try {
//     // const tour = await Tour.findById({ _id: req.params.id });
//     const tour = await Tour.findById(req.params.id);
//     // Tour.findOne({ _id: req.params.id });

//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
//   // console.log(req);
//   // console.log(req.params);

//   // Convert string to a number
//   // const id = req.params.id * 1;

//   // const tour = tours.find(el => el.id === id);

//   // // console.log(tour);

//   // // if (id > tours.length - 1) {
//   // if (!tour) {
//   //     return res.status(404).json({
//   //         status: 'fail',
//   //         message: 'Invalid id'
//   //     });
//   // }

//   // res.status(200).json({
//   //     status: 'success',
//   //     data: {
//   //         tour
//   //     }
//   // });
// };

// Function to catch async errors
// Pass function into another function
// The function we pass here is an asynchronous function and remember that async functins return promises and when there is an error inside of an async function that basically means that the promise gets rejected and so up here where we call that function we can then catch that error
// const catchAsync = fn => {
//   // Call function in here and this function should receive req, res, and in fact also next
//   fn(req, res, next).catch(err => next(err));
// };

// There are actually two big problems with the way that this is implemented right now so this way it wouln't really work at all.
// 1. The function call fn() has no way of knowing request response and next. We did not pass them into catchAsync here so really there's no way for the function to know the values of these parameters.
// 2. We're actually calling the async function using the parenthesis of course right and then inside of catchAsync we're also then right away calling the fn function and that's not how it is supposed to work. So exports.createTour should really be a function but not the result of calling a function but this function should not be called but instead it should sit here and wait until express calls it and express of course will call it as soon as someone hits the route that needs this controller function.
// The solution to that is to basically make the catchAsync function return another function which is then gonna be assigned to createTour so that function can then later be called when necessary.
// The catchAsync function returns an anonymous function which will then be assigned to createTour
// The anonymous function will get called as soon as a new tour should be created using the createTour handler.
// The goal of this function is to catch asynchronous errors
// Remember we need the next function in order to pass the error into it so that that error can then be handled in the global error handling middleware.
// const catchAsync = fn => {
//   // Call function in here and this function should receive req, res, and in fact also next
//   // Function return another function. This is a function that express is then going to call so here is where we then specify req, res and next
//   // Return an anonymous function
//   return (req, res, next) => {
//     // fn(req, res, next).catch(err => next(err));
//     fn(req, res, next).catch(next);
//   };
// };

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  console.log('New Tour:');
  console.log(newTour);

  // We no longer need the try catch block because that catch is now basically transferred to fn(req, res, next).catch(err => next(err)); It's no longer a catch block because in here it's just easier to use the promise that the fn function return.

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });

  // try {

  // } catch (err) {
  //   // Validation error
  //   // console.log('Error:');
  //   // console.log(err);
  //   // 400 error means bad request
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err,
  //     // message: 'Invalid data set'
  //   });
  // }

  // try {
  //   const newTour = await Tour.create(req.body);
  //   console.log('New Tour:');
  //   console.log(newTour);

  //   res.status(201).json({
  //     status: 'success',
  //     data: {
  //       tour: newTour,
  //     },
  //   });
  // } catch (err) {
  //   // Validation error
  //   // console.log('Error:');
  //   // console.log(err);
  //   // 400 error means bad request
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err,
  //     // message: 'Invalid data set'
  //   });
  // }
});
// exports.createTour = async (req, res) => {
//   try {
//     const newTour = await Tour.create(req.body);
//     console.log('New Tour:');
//     console.log(newTour);

//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour,
//       },
//     });
//   } catch (err) {
//     // Validation error
//     // console.log('Error:');
//     // console.log(err);
//     // 400 error means bad request
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//       // message: 'Invalid data set'
//     });
//   }
//   // console.log(req.body);
//   // console.log(req.body.name);

//   // const newTour = new Tour({});
//   // newTour.save();

//   // Call method directly on Model
//   // It returns a promise
//   // Tour.create({}).then();

//   // // Create a new id
//   // const newId = tours[tours.length - 1].id + 1;
//   // // Create a new tour
//   // // The Object.assign() allows us to create a new object by merging to existing objects together.
//   // const newTour = Object.assign({ id: newId }, req.body);

//   // // Push tours into the tours array
//   // tours.push(newTour);

//   // // Persist into file
//   // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//   //     // What we want to do as soon as the file is written?
//   //     // Well what we usually do is to send the newly created object as the response.
//   //     console.log(err);
//   //     res.status(201).json({
//   //         status: 'success',
//   //         data: {
//   //             tour: newTour
//   //         }
//   //     });
//   // });

//   // We always need to send back something in order to finish the so called request-response cycle.
//   // We send a response twice
//   // res.send('Done!');
// };

exports.updateTour = catchAsync(async (req, res, next) => {
  console.log('Request body:');
  console.log(req.body);

  // Query document that we want to update
  //     await Tour.findByIdAndUpdte({
  //     { _id: req.params.id },

  //    });

  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  console.log('Updated tour:');
  console.log(updatedTour);

  if (!updatedTour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  });
});

// exports.updateTour = async (req, res) => {
//   // if (id > tours.length - 1) {
//   // if (req.params.id * 1 > tours.length) {
//   //     return res.status(404).json({
//   //         status: 'fail',
//   //         message: 'Invalid id'
//   //     });
//   // }

//   console.log('Reques body:');
//   console.log(req.body);

//   try {
//     // Query document that we want to update
//     //     await Tour.findByIdAndUpdte({
//     //     { _id: req.params.id },

//     //    });

//     const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     console.log('Updated tour:');
//     console.log(updatedTour);

//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour: updatedTour,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

exports.deleteTour = catchAsync(async (req, res, next) => {
  // if (id > tours.length - 1) {
  // if (req.params.id * 1 > tours.length) {
  //     return res.status(404).json({
  //         status: 'fail',
  //         message: 'Invalid id'
  //     });
  // }

  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  // 204 means no content and we usually not send any data back which means the data that we're receiving now no longer exists
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// exports.deleteTour = async (req, res) => {
//   // if (id > tours.length - 1) {
//   // if (req.params.id * 1 > tours.length) {
//   //     return res.status(404).json({
//   //         status: 'fail',
//   //         message: 'Invalid id'
//   //     });
//   // }

//   try {
//     await Tour.findByIdAndDelete(req.params.id);

//     // 204 means no content and we usually not send any data back which means the data that we're receiving now no longer exists
//     res.status(204).json({
//       status: 'success',
//       data: null,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

exports.getToursStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: null,
        // _id: '$difficulty',
        // _id: { $toUpper: '$ratingsAverage' },
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: -1 },
    },
    // Repeat stages
    // Select all the documents that are not easy
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// exports.getToursStats = async (req, res) => {
//   try {
//     // The aggregation pipeline really is a mongodb feature but mongoose of course gives us access to it so that we can use it in the mongoose driver so using our Tour model in order to access the tour collection
//     // Pass array of stages
//     // The documents then pass through these one by one step by step in the defined sequence as we define it here
//     // Stages
//     // 1. $match: The match is basically is to select or to filter certain documents. It's just like filter object in MongoDB
//     // The match stage is the preliminary stage to then prepare for the next stages.
//     // 2. $group: It allows us to group documents together basically using accumulators and an accumulator is for example even calculating an average.
//     // The _id specifies what we want to group by for now we say null here because we want to have everything in one group so that we can calculate the statistics for all of the tours together and not separated by groups. Later we will group documents together by difficulty so we can then calculate the average for the easy, medium and difficult tours.
//     // For each of the document that's going to go through this pipeline one will be added to this numTours counter
//     // 3. $sort: Which field we want to sort this by and now here in the sorting we actually need to use the field names that we specified up here in the group we can no longer use the old names because at this point they are already gone and they no longer exist.
//     // avgPrice: 1 means ascending
//     const stats = await Tour.aggregate([
//       {
//         $match: { ratingsAverage: { $gte: 4.5 } },
//       },
//       {
//         $group: {
//           // _id: null,
//           // _id: '$difficulty',
//           // _id: { $toUpper: '$ratingsAverage' },
//           _id: { $toUpper: '$difficulty' },
//           numTours: { $sum: 1 },
//           numRatings: { $sum: '$ratingsQuantity' },
//           avgRating: { $avg: '$ratingsAverage' },
//           avgPrice: { $avg: '$price' },
//           minPrice: { $min: '$price' },
//           maxPrice: { $max: '$price' },
//         },
//       },
//       {
//         $sort: { avgPrice: -1 },
//       },
//       // Repeat stages
//       // Select all the documents that are not easy
//       // {
//       //   $match: { _id: { $ne: 'EASY' } },
//       // },
//     ]);

//     res.status(200).json({
//       status: 'success',
//       data: {
//         stats,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  console.log('Get monthly plan');
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    // Get tours by month
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    // Adds new fields to documents. $addFields outputs documents that contain all existing fields from the input documents and newly added fields.
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    // Sort by the number of tours
    {
      $sort: { numToursStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan,
    },
  });
});

// exports.getMonthlyPlan = async (req, res) => {
//   try {
//     console.log('Get monthly plan');

//     //   {
//     //     "_id": "6509187f049378cf3fe034d5",
//     //     "name": "The Snow Adventurer",
//     //     "duration": 4,
//     //     "maxGroupSize": 10,
//     //     "difficulty": "difficult",
//     //     "ratingsAverage": 4.5,
//     //     "ratingsQuantity": 13,
//     //     "price": 997,
//     //     "summary": "Exciting adventure in the snow with snowboarding and skiing",
//     //     "description": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum!\nDolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, exercitation ullamco laboris nisi ut aliquip. Lorem ipsum dolor sit amet, consectetur adipisicing elit!",
//     //     "imageCover": "tour-3-cover.jpg",
//     //     "images": [
//     //         "tour-3-1.jpg",
//     //         "tour-3-2.jpg",
//     //         "tour-3-3.jpg"
//     //     ],
//     //     "startDates": [
//     //         "2022-01-05T05:00:00.000Z",
//     //         "2022-02-12T05:00:00.000Z",
//     //         "2023-01-06T05:00:00.000Z"
//     //     ]
//     // }

//     // The easiest way would basically be to have one tour for each of these dates here and we can do that using the aggregation pipeline. There is a stage for doing exactly that and that is called unwind.
//     // What unwind is gonna do is to basically deconstruct and array field from the input documents and then output one document for each element of the array so basically we want to have one tour for each of the states in the array.
//     // Select the document for the year that was passed in and remember that which stage we use for that that's right we use $match.
//     // So remember that match is basically to select documents so just to do a query.
//     // Aggregation Pipeline Operators

//     const year = req.params.year * 1;

//     const plan = await Tour.aggregate([
//       {
//         $unwind: '$startDates',
//       },
//       {
//         $match: {
//           startDates: {
//             $gte: new Date(`${year}-01-01`),
//             $lte: new Date(`${year}-12-31`),
//           },
//         },
//       },
//       // Get tours by month
//       {
//         $group: {
//           _id: { $month: '$startDates' },
//           numToursStarts: { $sum: 1 },
//           tours: { $push: '$name' },
//         },
//       },
//       // Adds new fields to documents. $addFields outputs documents that contain all existing fields from the input documents and newly added fields.
//       {
//         $addFields: { month: '$_id' },
//       },
//       {
//         $project: {
//           _id: 0,
//         },
//       },
//       // Sort by the number of tours
//       {
//         $sort: { numToursStarts: -1 },
//       },
//       {
//         $limit: 12,
//       },
//     ]);

//     res.status(200).json({
//       status: 'success',
//       results: plan.length,
//       data: {
//         plan,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };
