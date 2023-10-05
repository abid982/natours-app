// Import third party modules
const express = require('express');

// Third party middleware called morgan which makes our development life a bit easier

const morgan = require('morgan');
// There are a log of third party middlewares
// https://expressjs.com/en/resources/middleware.html
// GET /api/v1/tours/ 200 13.957 ms - 8621

// Import our own modules
const AppError = require('./utils/appError');
const ErrorHandler = require('./controllers/errorController');

// Our own modules
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Assign the result of calling express
// This is actually a function which upon calling will add a bunch of methods to our app variable
const app = express();

// 1) Middlewares

// So calling morgan function will return a function similar to callback function in app.use((req, res, next) => { })
// app.use(morgan('dev'));

// console.log('Process environment:');
// console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// In order to use to middleware we use app.use() so the use method is the one that we use in order to actually use middleware so add middleware to our middleware stack so this express.json() function here calling the json method basically return a function so that function is then added to the middleware stack.
// So similar to that we create our own middleware function
// Include middleware at the top of the file
app.use(express.json());

// Use a simple built-in middleware
// Pass directory from which we want to serve static files and in this case is the public directory.
// This is a built-in middleware function in Express. It serves static files and is based on serve-static.
app.use(express.static(`${__dirname}/public`));
// http://127.0.0.1:3000/overview.html
// Why we don't need public folder in url?
// Well simply because when we open up a url that it can't find in any of our routes it will then look in that public folder that we defined and it kind of sets that folder to the root.
// http://127.0.0.1:3000/img/pin.png

// Creating our own middleware
// We still need to use app.use() and now in here all we have to do is to pass in our function that want to add to the middleware stack.
// Note: In each middleware function we have access to the request and the response but also we have the next function
// Add third argument to the middleware function
// Define a middleware function
// Send a simple request to our api
// This single middleware applies to each and every single request and that's because we didn't specify any route.
app.use((req, res, next) => {
  // Run code each time there is a new request
  console.log('Hello from the middleware!');

  console.log('Programming error which is non-operational:');
  console.log(x);

  // We actually need to call the next function and if we didn't call next well then the request response cycle would really be stuck at this point. We wouldn't be ablt to move on and we would never ever send back a response to the client.
  // Don't forget to use next in all of your middleware
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  // Don't forget to call the next middleware on the stack
  next();
});

// Creating and Mounting Multiple Routers
// Create a new router and save into a variable
// How to connect this new router with our application? Well we will use it as middleware because this tour router here is actually a middleware.
// The tourRouter middleware only runs on route /api/v1/tours and so once we are in the router then we already are at /api/v1/tours route.

// The tourRouter here is a middleware and we want to use this middleware for this specific /api/v1/tours route. The tourRouter is a middleware function on route /api/v1/tours.
// We actually create a small sub app for each resources.
// This is already in our kind of parent route up here right. The tourRouter is a small mini application.
// We cannot user routers before we actually declare them.
// If there is now a request for /api/v1/users/:id then the request will enter the middleware stack and when it hits this middleware here it will run the user router because this route here is matched and so then it enters the user router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// For all the verbs
// For all the routes

// app.all()
// app.get()
// app.post()
// app.patch()
// app.delete()

// All of the urls are catched here
app.all('*', (req, res, next) => {
  // Send back response in the JSON format so not the HTML that we have right now
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl}`,
  // });

  // CREATE AN ERROR
  // Use built in Error Constructor in order to create an error
  // Pass string and that string is going to be the message property

  // We're creating an error and then we define these status and status code properties on it so that our error handling middleware can then use them in the next step but how do we actually reach that next step so that next middleware. Well as always we use next but this time we use next in a special way because now we need to actually pass that error into next so if the next function receives an argument no matter what it is express will automatically know that there was an error so it will assume that whatever we pass into next is gonna be an error and that applies to every next function in every single middleware anywhere in our application. So again whenever we pass anything into next it will assume that it is an error and it will then skip all the middlewares in the middleware stack and send the error that we passed in to our gobal error handling middleware which will then of course be executed.
  // const err = new Error(`Can't find ${req.originalUrl}`);
  // err.statusCode = 404;
  // err.status = 'fail';

  // next(err);

  const err = new AppError(`Can't find ${req.originalUrl}`, 404);
  console.log('Error object from AppError Class:');
  console.log(err);
  next(err);
});

// IMPLEMENTING A GLOBAL ERROR HANDLING MIDDLEWARE
// HANDLE OPERATIONAL ERROR
// Expres already comes with middleware handlers out of the box
// Define middleware function so define an error handling middleware all we need to do is to give the middleware function four arguments and express will then automatically recognize it as an error handling middleware and therefore only call it when there is an error.
// This middleware function is an error first function
// app.use((err, req, res, next) => {

//   // The error.stack will basically show us where the error happened.
//   console.log('Error stack trace:');
//   console.log(err.stack);

//   // Default status code if there is not exist
//   // 500 internal server error and it's a standard error

//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';
//   // Create an error
//   // Send back response to the client
//   // Read status code from error object
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });

app.use(ErrorHandler);

// 3) Routes
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// tourRouter.route('/api/v1/tours').get(getAllTours).post(createTour);
// Sub application
// Mini application

// Note: When we make a call to this route 127.0.01:3000/api/v1/tours/ we don't have "Hello from the middleware!" because the above route() handler middleware comes before our own middleware and this route handler which in this case is getAllTours() actually ends the request response cycle.
// With res.json() we actually end the request response cycle and so the next middleware in the stack which in this case the custom one that we created will then not be called.

// app.use((req, res, next) => {
//     // Run code each time there is a new request
//     console.log('Hello from the middleware!');

//     // We actually need to call the next function and if we didn't call next well then the request response cycle would really be stuck at this point. We wouldn't be ablt to move on and we would never ever send back a response to the client.
//     // Don't forget to use next in all of your middleware
//     next();
// });

// app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);
// tourRouter.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

// Let's now implement routes for the users resource. So our API will have a couple of different resources. The first one that we already talked about and started to implement is the tours resource but another one will be the users resource so that for example we can create a user account and have different user roles and all that good stuff that comes with users right.
// Now of course for now this users resource will be very similar to the tours resource.

// app.route('/api/v1/users').get(getAllUsers).post(createUser);

// app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

// 4) Start the server
// Create a port
// const port = 3000;

// app.listen();

// // To start a server use app.listen() method
// // Pass port and a callback function and this callback function will be called as soon as the server starts listening
// app.listen(port, () => {
//     console.log(`App running on port ${port}...`);
// });
module.exports = app;
