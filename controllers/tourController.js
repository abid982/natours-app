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
        // BUILD QUERY
        // 1A) Filtering
        // Problem
        // const queryObj = req.query;
        // Create a shallow copy of an object
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];

        excludedFields.forEach(el => delete queryObj[el]);

        console.log('Request query:');
        console.log(req.query, queryObj);
        // { duration: '5', difficulty: 'easy' }
        // 127.0.01:8000/api/v1/tours?duration=5&difficulty=easy&page=2

        // const tours = await Tour.find();
        // const tours = await Tour.find({
        //     duration: 5,
        //     difficulty: 'easy'
        // });

        // const tours = await Tour.find(req.query);
        // const tours = await Tour.find(queryObj);

        // 1B) Advanced filtering
        // gte, gt, lte, lt
        // Convert JavaScript Object to String
        let queryStr = JSON.stringify(queryObj);

        console.log('Query string before:');
        console.log(queryStr);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        console.log('Query string after:');
        console.log(queryStr);

        // EXECUTE QUERY
        // const query = Tour.find(queryObj);
        let query = Tour.find(JSON.parse(queryStr));
        // query.sort().select().skip().limit()

        const testTour = await Tour.find({
            name: "The Wine Taster"
        });
        console.log('Test tour:');
        console.log(testTour);

        // 2) Sorting
        // 127.0.01:8000/api/v1/tours?sort=price
        // 127.0.01:8000/api/v1/tours?sort=-price
        if (req.query.sort) {
            // Chain operations
            // Sort query
            // query = query.sort(req.query.sort);
            // sort('price ratingsAverage');
            // 127.0.01:8000/api/v1/tours?sort=price,-ratingsAverage

            const sortBy = req.query.sort.split(',').join(' ');

            console.log('Sort by:');
            console.log(sortBy);
            query = query.sort(sortBy);
        } else {
            // Newest tour appears first
            query = query.sort('-createdAt');
        }

        // 3) Limiting fields
        // 127.0.01:8000/api/v1/tours?fields=name,duraction,difficulty,price
        if (req.query.fields) {
            console.log('Request query fields:');
            console.log(req.query.fields);
            // { fields: 'name,duraction,difficulty,price' }

            const fields = req.query.fields.split(',').join(' ');
            // Selecting only certain field names is called projecting.
            // query = query.select('name duration price difficulty');
            query = query.select(fields);
        } else {
            // Default if user doesn't specify something
            // Minus means excluding
            query = query.select('-__v')
        }

        // 4) Pagination
        // page=2&limit=10
        // query = query.skip(10).limit(10);
        // Page 1 --> 1 - 10 Results
        // Page 2 --> 11 - 20 Results
        // Page 3 --> 21 - 30 Results
        // limit: The amount of results that we want in the query
        // skip(): The amount of results that should be skipped before actually querying data
        // We need some way of calculating skip value so basically based on page and the limit
        // Get the page and the limit from the query string and we should also define some default values because we still want to have pagination even if the user doen't specify any page or any limit because for example we have a million results in our database and then of course when the user does the request we would not simply show all of the ten million results.

        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
        // query = query.skip(10).limit(10);
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();

            console.log('Number of tours in database:');
            console.log(numTours);
            console.log(skip);

            if (skip >= numTours) throw new Error('This page does not exist');
        }

        const tours = await query;
        // MAKING THE API BETTER ADVANCED FILTERING
        // { difficulty: 'easy', duration: 5 }
        // { duration: { gte: '5' }, difficulty: 'easy' }
        // { difficulty: 'easy', duration: { $gte: 5 } }
        // 127.0.01:8000/api/v1/tours?duration[gte]=5&difficulty=easy&page=2

        // Special mongoose methods
        // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
        console.log('All tours:');
        console.log(tours);

        // SEND RESPONSE
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
