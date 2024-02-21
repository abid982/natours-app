const express = require('express');
const viewsController = require('./../controllers/viewsController');

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

router.get('/', viewsController.getOverview);

router.get('/tour', viewsController.getTour);

module.exports = router;
