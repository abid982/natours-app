const fs = require('fs');

// Read file
// So __dirname is the folder where the current script is located and so that is this main folder.
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));
console.log(tours);

exports.checkID = (req, res, next, val) => {
    console.log(`Tour is id: ${val}`);
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    next();
};

exports.checkBody = (req, res, next) => {

    console.log('Request in check body middleware handler:');
    console.log(req.body);
    // { name: 'Murree Tour', duration: 35, difficulty: 'medium' }

    if (!req.body.name || !req.body.duration) {
       return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        });
    }

    next();
};

// 2) Route Handlers
exports.getAllTours = (req, res) => {
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

exports.getTour = (req, res) => {
    // console.log(req);
    // console.log(req.params);

    // Convert string to a number
    const id = req.params.id * 1;

    const tour = tours.find(el => el.id === id);

    // console.log(tour);

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

exports.createTour = (req, res) => {
    // console.log(req.body);
    // console.log(req.body.name);

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

exports.updateTour = (req, res) => {

    // if (id > tours.length - 1) {
    // if (req.params.id * 1 > tours.length) {
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'Invalid id'
    //     });
    // }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    });
};

exports.deleteTour = (req, res) => {

    // if (id > tours.length - 1) {
    // if (req.params.id * 1 > tours.length) {
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'Invalid id'
    //     });
    // }

    // 204 means no content and we usually not send any data back which means the data that we're receiving now no longer exists
    res.status(204).json({
        status: 'success',
        data: null
    });
};
