const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
// POST /reviews

// GET /tour/234fad4/reviews

// router
//   .route('/')
//   .get(reviewController.getAllReviews)
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview,
//   );

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

// router.route('/:id').update(reviewController.updateReview);
// router.route('/:id').update(reviewController.updateReview);
router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;
