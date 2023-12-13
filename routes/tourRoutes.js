// Import core modules
const express = require('express');

const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
// const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// NESTED ROUTE
// Note: There is a parent child relationship and in this case reviews is a child of tour parent.
// This nested route basically means to access the reviews resource on the tours resource.
// POST /tour/234fad5/reviews
// We have the tour id right in the url and the user id actually come from the currently logged in user.

// Access reviews from a certain tour
// GET /tours/234fad4/reviews

// We can go even further and specify the id of the review
// GET /tours/234fad4/reviews/84887da

// This is a way more easier way of reading and understanding how API works for our API users. It's a way easier for messing around with query strings and all that stuff like that also it really shows how there's a clear relationship between the resources.

// Let's now actually implement this starting with the POST route. Now since the route actully starts with the tours it will be of course redirected to our tour router.

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview,
//   );

// Nested routes with express
router.use('/:tourId/reviews', reviewRouter);

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
// router.route('/').get(tourController.getAllTours).post(tourController.checkBody, tourController.createTour);

// Run middleware before we get all tours
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getToursStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// Protect tour routes
// This middleware function protect runs first and then getAllTours and this middleware will then either return an error if the user is not authenticated so if he's not logged in, or it will call the next middleware which is in this case the getAllTours handler and that then effectively protects this route from unauthorized access.
// In auth controller create a new middleware function
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

// Default export
module.exports = router;
