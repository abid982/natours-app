const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // 204 means no content and we usually not send any data back which means the data that we're receiving now no longer exists
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const updatedDocument = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    // console.log('Updated tour:');
    // console.log(updatedDocument);

    if (!updatedDocument) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedDocument,
      },
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    // Note: We will first create the query and then if there is populate options object we will add to the query and then by the end await to that query

    let query = Model.findById(req.params.id);

    // Virtual populate: Specify the name of the field that we want to populate
    // const doc = await Model.findById(req.params.id).populate('reviews');

    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;

    // If there is no doc then call next with an error so in order to jump straight into our error handling middleware
    // Immediatedly return because we don't want to move on to the next line
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // console.log('Req headers:');
    // console.log(req.headers);
    // Create a new object
    // Pass query and query string
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const tours = await query;
    const doc = await features.query;

    // SEND RESPONSE
    // JSEND Data Specification
    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//     // if (id > tours.length - 1) {
//     // if (req.params.id * 1 > tours.length) {
//     //     return res.status(404).json({
//     //         status: 'fail',
//     //         message: 'Invalid id'
//     //     });
//     // }

//     const tour = await Tour.findByIdAndDelete(req.params.id);

//     if (!tour) {
//       return next(new AppError('No tour found with that ID', 404));
//     }

//     // 204 means no content and we usually not send any data back which means the data that we're receiving now no longer exists
//     res.status(204).json({
//       status: 'success',
//       data: null,
//     });
//   });

// exports.getTour = catchAsync(async (req, res, next) => {
//   // const tour = await Tour.findById({ _id: req.params.id });
//   // const tour = await Tour.findById(req.params.id);

//   // Virtual populate: Specify the name of the field that we want to populate
//   const tour = await Tour.findById(req.params.id).populate('reviews');

//   // const tour = await Tour.findById(req.params.id).populate('guides');

//   // Note: Use query middleware to avoid from duplicate code
//   // const tour = await Tour.findById(req.params.id).populate({
//   //   path: 'guides',
//   //   select: '-__v -role',
//   // });

//   // Tour.findOne({ _id: req.params.id });

//   // If there is no tour then call next with an error so in order to jump straight into our error handling middleware
//   // Immediatedly return because we don't want to move on to the next line
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });
