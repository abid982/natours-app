const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Sepcial authentication route
// The signup route is a special kind of endpoint. It doesn't fit the rest architecture that we talked about before.
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// router.patch(
//   '/updatePassword',
//   authController.protect,
//   authController.updatePassword,
// );

// router.get(
//   '/me',
//   authController.protect,
//   userController.getMe,
//   userController.getUser,
// );

// router.patch('/updateMe', authController.protect, userController.updateMe);

// router.delete('/deleteMe', authController.protect, userController.deleteMe);

// // For administration
// router
//   .route('/')
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

// PROTECT ALL THE ROUTES THAT COME AFTER router.use(authController.protect). BECAUSE MIDDLEWARE RUNS IN SEQUENCE
// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);

router.patch('/updateMe', userController.updateMe);

router.delete('/deleteMe', userController.deleteMe);

// For administration
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
