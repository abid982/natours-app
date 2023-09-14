// Import third party modules
const express = require('express');

// Third party middleware called morgan which makes our development life a bit easier
var morgan = require('morgan');
// There are a log of third party middlewares
// https://expressjs.com/en/resources/middleware.html
// GET /api/v1/tours/ 200 13.957 ms - 8621

// Our own modules
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Assign the result of calling express
// This is actually a function which upon calling will add a bunch of methods to our app variable
const app = express();

// 1) Middlewares

// So calling morgan function will return a function similar to callback function in app.use((req, res, next) => { })
app.use(morgan('dev'));

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
