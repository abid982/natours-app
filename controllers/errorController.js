module.exports = (err, req, res, next) => {

    // The error.stack will basically show us where the error happened.
    console.log('Error stack trace:');
    console.log(err.stack);

    // Default status code if there is not exist
    // 500 internal server error and it's a standard error

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // Create an error
    // Send back response to the client
    // Read status code from error object
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};
