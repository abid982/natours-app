const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// // Render page in browser
// router.get('/', (req, res) => {
//   // res.status(200).json()
//   // Render the template athat we pass in
//   res.status(200).render('base', {
//     tour: 'The Forest Hiker',
//     user: 'Jonas',
//   });
// });

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);

// router.get('/tour/:slug', authController.protect, viewsController.getTour);
router.get('/tour/:slug', viewsController.getTour);

// Create a login route
// Create a controller
// Render a template
// Static template
// /login route

router.get('/login', viewsController.getLoginForm);

module.exports = router;
