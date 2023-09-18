const fs = require('fs');
const Tour = require('./../models/tourModel');

// Read file
// So __dirname is the folder where the current script is located and so that is this main folder.
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));
// console.log(tours);

// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour is id: ${val}`);
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }

//     next();
// };

// exports.checkBody = (req, res, next) => {

//     console.log('Request in check body middleware handler:');
//     console.log(req.body);
//     // { name: 'Murree Tour', duration: 35, difficulty: 'medium' }

//     if (!req.body.name || !req.body.duration) {
//        return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         });
//     }

//     next();
// };

// 2) Route Handlers
exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        console.log('All tours:');
        console.log(tours);

        // JSEND Data Specification
        res.status(200).json({
            status: 'success',
            // requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
    // Send back all the tours to the client
    // success, fail(error at the client), error(error at the server)

    // console.log(req.requestTime);
};

exports.getTour = async (req, res) => {

    try {
        // const tour = await Tour.findById({ _id: req.params.id });
        const tour = await Tour.findById(req.params.id);
        // Tour.findOne({ _id: req.params.id });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
    // console.log(req);
    // console.log(req.params);

    // Convert string to a number
    // const id = req.params.id * 1;

    // const tour = tours.find(el => el.id === id);

    // // console.log(tour);

    // // if (id > tours.length - 1) {
    // if (!tour) {
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'Invalid id'
    //     });
    // }

    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour
    //     }
    // });
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        console.log('New Tour:');
        console.log(newTour);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        // Validation error
        // console.log('Error:');
        // console.log(err);
        // 400 error means bad request
        res.status(400).json({
            status: 'fail',
            message: err
            // message: 'Invalid data set'
        });
    }
    // console.log(req.body);
    // console.log(req.body.name);

    // const newTour = new Tour({});
    // newTour.save();

    // Call method directly on Model
    // It returns a promise
    // Tour.create({}).then();

    // // Create a new id
    // const newId = tours[tours.length - 1].id + 1;
    // // Create a new tour
    // // The Object.assign() allows us to create a new object by merging to existing objects together.
    // const newTour = Object.assign({ id: newId }, req.body);

    // // Push tours into the tours array
    // tours.push(newTour);

    // // Persist into file
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    //     // What we want to do as soon as the file is written?
    //     // Well what we usually do is to send the newly created object as the response.
    //     console.log(err);
    //     res.status(201).json({
    //         status: 'success',
    //         data: {
    //             tour: newTour
    //         }
    //     });
    // });

    // We always need to send back something in order to finish the so called request-response cycle.
    // We send a response twice
    // res.send('Done!');
};

exports.updateTour = async (req, res) => {

    // if (id > tours.length - 1) {
    // if (req.params.id * 1 > tours.length) {
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'Invalid id'
    //     });
    // }

    console.log('Reques body:');
    console.log(req.body);

    try {
        // Query document that we want to update
    //     await Tour.findByIdAndUpdte({
    //     { _id: req.params.id },

        //    });

        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        console.log('Updated tour:');
        console.log(updatedTour);

    res.status(200).json({
        status: 'success',
        data: {
            tour: updatedTour
        }
    });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.deleteTour = async (req, res) => {

    // if (id > tours.length - 1) {
    // if (req.params.id * 1 > tours.length) {
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'Invalid id'
    //     });
    // }

    try {
        await Tour.findByIdAndDelete(req.params.id);

         // 204 means no content and we usually not send any data back which means the data that we're receiving now no longer exists
        res.status(204).json({
            status: 'success',
            data: null
        });

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};
