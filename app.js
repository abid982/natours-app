// Import core modules
const fs = require('fs');

// Import 3rd party modules
const express = require('express');

// Assign the result of calling express
// This is actually a function which upon calling will add a bunch of methods to our app variable
const app = express();

// Include middleware at the top of the file
// This express.json() is a middleware and middleware is basically just a function that can modify the incoming request data so it's called middleware because it stands between so in the middle of the request and the response so it's just a step that the request goes through while it's being processed and the step the request goes through in this example is simply that the data from the body is added to it so it's added to the request object by using this middleware.
// We use app.use() method in order to use middleware
app.use(express.json());

// Define routes
// Remember that routing means basically to determine how an application responds to a certain client request so to a certain url right and actually it's not just the url but also the http method which is used for that request.
// Note: By using the json() method this will automatically set our content-type to 'application/json'
// 127.0.0.1:3000
// app.get('/', (req, res) => {

//     // Send data back as response to the client
//     // res.status(200).send('Hello from the server side!');
//     res.status(200).json({
//         message: 'Hello from the server side!',
//         app: 'Natours'
//     })
// });

// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint...');
// });

////////////////////////////////////////////
// Starting Our API Handling GET Requests

// Read file
// So __dirname is the folder where the current script is located and so that is this main folder.
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));
console.log(tours);

// Route handler
app.get('/api/v1/tours', (req, res) => {
    // Send back all the tours to the client
    // success, fail(error at the client), error(error at the server)
    // JSEND Data Specification
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});

// So now we have our post route all setup it's working now and we also get access to the body and so what we want to do now is to actually persist our data into this tours-simple.json file so that our data is saved to our fictional database.
app.post('/api/v1/tours', (req, res) => {
    // Now remember that with the post request we can send data from the client to the server and this data is then ideally available on the request object so the request object is what holds all the data all the information about the request that was done and if that request contains some data that was sent well then that data should be on the request object.
    // Well out of the box express does not put that body data on the request object an so in order to to have that data available we have to use something called middleware.
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
    // We're inside of a callback function that is going to run in the event loop and so we can never ever block the event loop and so what we're going to use write file and not the synchronous one so we want to pass in a callback function that is going to be processed in the background and as soon as it's ready it's going to put its event in one of the event loop queue which is then going to be handled as soon as the event loop passes that phase
    // Overwrite the file
    // This is the file where we want to write to and then the data that we want to write which is tours
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        // What we want to do as soon as the file is written?
        // Well what we usually do is to send the newly created object as the response.
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
});

// Create a port
const port = 3000;

app.listen();

// To start a server use app.listen() method
// Pass port and a callback function and this callback function will be called as soon as the server starts listening
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

