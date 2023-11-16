const express = require('express');
const path = require('path')
const userRouter = express.Router();
const userController = require('../Controller/User/userController');
const userProductController = require('../Controller/User/userProductController')
const userWishlistController = require('../Controller/User/userWishlistController')
const auth = require('../Middleware/auth')

userRouter.use('/uploads', express.static('uploads'));
userRouter.use('/Public', express.static('Public'));
userRouter.use('/', express.static('Public'));


userRouter.get('/', auth.isUserBlocked, userController.getHomePage);
// User Login
userRouter.get('/userLogin', userController.userLogin);
userRouter.post('/postUserLogin', userController.postUserLogin);
userRouter.get('/userLogout', userController.getUserLogout);
// User Signup
userRouter.get('/userSignup', userController.getUserSignup);
userRouter.post('/postUserSignup', userController.postUserSignup);
// send otp
userRouter.post('/sendOtp', userController.postSendOtp)

// All category
userRouter.get('/allCategory', auth.isUserBlocked, userProductController.getAllCategory)
// View product
userRouter.get('/viewProduct', auth.isUserBlocked, userProductController.getViewProduct)

// Wishlist view
userRouter.get('/wishlist', auth.isUser, auth.isUserBlocked, userWishlistController.getWishlist)
// Wishlist Add & Delete products
userRouter.get('/addToWishlist', userWishlistController.getAddToWishlist)
userRouter.get('/wishlistDelete', userWishlistController.getWishlistDelete)

module.exports = userRouter;
