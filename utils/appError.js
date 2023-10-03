// We actually want all of our app error objects to then inherit from the built-in error

// One class inherit from the other
class AppError extends Error {
  // Pass into a new object created from the App Error Class is gonna be the message and the status code
  // The constructor method is called each time that we create a new object out of this class.
  // Now as usual when we extend a prent class we call super() in order to call the parent constructor right and we do that with message because the message is actuallly the only parameter that the built in error accepts
  constructor(message, statusCode) {
    // By doing this parent call we already set the message property to our incoming message.
    super(message);

    this.statusCode = statusCode;
    // Status depends on status code
    // Note: When the status code is 400 then the status will be fail and if it's a 500 then it's going to be an error so let's simply test if a status code starts with 4.
    // Convert status code to a string
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // Operational errors
    // Create a property
    // We're doing that so that later we can then test for this and only send error messages back to the client for these operational errors that we created using this class and this is useful because some other crazy unexpected errors that might happen in our application for example a programming error or some bug in once of the packages that we require into our app and these errors will then of course not this isOperational property on them.
    // We also need to capture the stack trace.
    this.isOperational = true;

    // So in this way when a new object is created and the constructor function is called then that function call is not going to appear in the stack trace and will not pollute it.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
