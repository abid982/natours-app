// Import core modules
const express = require('express');

const tourController = require('./../controllers/tourController');

const router = express.Router();

// PARAM MIDDLEWARE
// Param middleware is a middleware that only runs for certain parameters so basically when we have certain parameter in url in our case is the id.
// Now in our example here the only parameter that might in the route url is the id so we can write middleware that only runs when this id is present in url
// In parameter middleware there is a third argument which is value of parameter in question
// router.param('id', (req, res, next, val) => {
//     console.log(`Tour is id: ${val}`);

//     next();
// });

// router.param('id', tourController.checkID);

// Create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400 (bad request which means invalid request from the client)
// Add it to the post handler stack

// Create multiple middleware functions
// Run a middleware before create tour to actually check the data that is coming in the body.
router.route('/').get(tourController.getAllTours).post(tourController.checkBody, tourController.createTour);

router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

// Default export
module.exports = router;
