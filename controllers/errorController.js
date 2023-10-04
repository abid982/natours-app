const AppError = require('./../utils/appError');

/*
    "error": {
        "stringValue": "\"6513fd53f389d18499813ec30\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "6513fd53f389d18499813ec30",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"6513fd53f389d18499813ec30\" (type string) at path \"_id\" for model \"Tour\""
    }
*/
const handleCastErrorDB = err => {
  // We have path and value so the path here is the name of the field for which the input data is in the wrong format. So this might not only happen for the id it really for any field that we query for with the value in the wrong format.
  // So let's now basically create a string that says we have an invalid id with the value of wwwwww so it's path and value
  console.log('Hanlde cast error DB');

  // Create a message
  const message = `Invalid ${err.path}: ${err.value}.`;

  // Return our own AppError
  // Pass message and 400 status code which means bad request.
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  // Create an error
  // Send back response to the client
  // Read status code from error object
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error, don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log('Error controller!');
  // The error.stack will basically show us where the error happened.
  console.log('Error stack trace:');
  console.log(err.stack);

  // Default status code if there is not exist
  // 500 internal server error and it's a standard error

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // If there is a cast error then call a special function and pass error that mongoose gives us
    // Create a new error created with AppError Class and that error will be marked as operational
    // It will return an error so save into a variable
    // It's not a good practice at all to override arguments of a function so err comes from middleware function.
    // Solution: Create a hard copy of error object

    // let error = { ...err };

    let error = JSON.parse(JSON.stringify(err));

    // console.log('Errrror:');
    // console.log(err);
    // console.log('Errror:');
    // console.log(error);

    // console.log('Error name:');

    console.log('type of error object:');
    console.log(typeof err);

    // if (err.name === 'CastError') {
    //   console.log('cast error block run');
    //   err = handleCastErrorDB(err);
    // }

    if (error.name === 'CastError') {
      console.log('cast error block run');
      error = handleCastErrorDB(error);
    }

    // console.log('Error in error controller for testing:');
    // console.log(error);
    // console.log(error.isOperational);

    console.log('error in production:');
    console.log(err);
    console.log('Error name:');
    console.log(err.name);
    console.log('type of cast error');
    console.log(typeof err.name);

    // sendErrorProd(err, res);
    sendErrorProd(error, res);
    // res.status(400).json({
    //   status: error.status,
    //   error: error,
    //   message: error.message,
    //   stack: error.stack,
    // });

    /*
      {
    "error": {
        "stringValue": "\"hjhjk\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "hjhjk",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"hjhjk\" (type string) at path \"_id\" for model \"Tour\""
    },
    "message": "Cast to ObjectId failed for value \"hjhjk\" (type string) at path \"_id\" for model \"Tour\""
      }
    */
  }
};
