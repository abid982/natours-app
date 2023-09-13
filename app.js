// Import core modules
const fs = require('fs');

// Import third party modules
const express = require('express');

// Third party middleware called morgan which makes our development life a bit easier
var morgan = require('morgan');
// There are a log of third party middlewares
// https://expressjs.com/en/resources/middleware.html
// GET /api/v1/tours/ 200 13.957 ms - 8621

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

// Read file
// So __dirname is the folder where the current script is located and so that is this main folder.
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));
console.log(tours);

// 2) Route Handlers
const getAllTours = (req, res) => {
    // Send back all the tours to the client
    // success, fail(error at the client), error(error at the server)

    console.log(req.requestTime);

    // JSEND Data Specification
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
};

const getTour = (req, res) => {
    console.log(req);
    console.log(req.params);

    // Convert string to a number
    const id = req.params.id * 1;

    const tour = tours.find(el => el.id === id);

    console.log(tour);

    // if (id > tours.length - 1) {
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};

const createTour = (req, res) => {
    console.log(req.body);
    console.log(req.body.name);

    // Create a new id
    const newId = tours[tours.length - 1].id + 1;
    // Create a new tour
    // The Object.assign() allows us to create a new object by merging to existing objects together.
    const newTour = Object.assign({ id: newId }, req.body);

    // Push tours into the tours array
    tours.push(newTour);

    // Persist into file
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        // What we want to do as soon as the file is written?
        // Well what we usually do is to send the newly created object as the response.
        console.log(err);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    });

    // We always need to send back something in order to finish the so called request-response cycle.
    // We send a response twice
    // res.send('Done!');
};

const updateTour = (req, res) => {

    // if (id > tours.length - 1) {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    });
};

const deleteTour = (req, res) => {

    // if (id > tours.length - 1) {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id'
        });
    }

    // 204 means no content and we usually not send any data back which means the data that we're receiving now no longer exists
    res.status(204).json({
        status: 'success',
        data: null
    });
};

const getAllUsers = (req, res) => {
    // 500 error code means internal server error
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

const getUser = (req, res) => {
    // 500 error code means internal server error
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

const createUser = (req, res) => {
    // 500 error code means internal server error
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

const updateUser = (req, res) => {
    // 500 error code means internal server error
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

const deleteUser = (req, res) => {
    // 500 error code means internal server error
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

// Creating and Mounting Multiple Routers
// Create a new router and save into a variable
// How to connect this new router with our application? Well we will use it as middleware because this tour router here is actually a middleware.
// The tourRouter middleware only runs on route /api/v1/tours and so once we are in the router then we already are at /api/v1/tours route.
const tourRouter = express.Router();
const userRouter = express.Router();

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
tourRouter.route('/').get(getAllTours).post(createTour);


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
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

// Let's now implement routes for the users resource. So our API will have a couple of different resources. The first one that we already talked about and started to implement is the tours resource but another one will be the users resource so that for example we can create a user account and have different user roles and all that good stuff that comes with users right.
// Now of course for now this users resource will be very similar to the tours resource.

// app.route('/api/v1/users').get(getAllUsers).post(createUser);
userRouter.route('/').get(getAllUsers).post(createUser);

// app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// 4) Start the server
// Create a port
const port = 3000;

app.listen();

// To start a server use app.listen() method
// Pass port and a callback function and this callback function will be called as soon as the server starts listening
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
