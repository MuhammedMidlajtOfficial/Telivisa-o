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

//Landing page
userRouter.get('/', auth.isUserBlocked, userController.getHomePage);


// User Login & Logout
userRouter.get('/userLogin', userController.userLogin);
userRouter.get('/userLogout', userController.getUserLogout);
// User Signup
userRouter.get('/userSignup', userController.getUserSignup);
userRouter.post('/postUserSignup', userController.postUserSignup);
// Send OTP
userRouter.post('/sendOtp', userController.postSendOtp)
// Verify OTP
userRouter.post('/verifyOtp', userController.postVerifyOtp);
userRouter.get('/resendOtp', userController.getResendOtp)


// Forgot password
userRouter.get('/forgotPassword', userController.getForgotPassword)
userRouter.post('/sendResetPassword', userController.postSendResetPassword)
// verify forgot Otp
userRouter.post('/verifyResetOtp', userController.postVerifyResetOtp)

// Reset Password
userRouter.post('/resetUserPassword',userController.postResetUserPassword)

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
