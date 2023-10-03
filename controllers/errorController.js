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
    isOperational: true,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      isOperational: true,
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
    sendErrorProd(err, res);
  }
};
