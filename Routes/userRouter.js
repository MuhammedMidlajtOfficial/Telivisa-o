const express = require('express');
const path = require('path')
const userRouter = express.Router();
const userController = require('../Controller/User/userController');
const userProductController = require('../Controller/User/userProductController')
const userWishlistController = require('../Controller/User/userWishlistController')
const userProfileController = require('../Controller/User/userProfileController')
const userCartController = require('../Controller/User/userCartController')
const userCheckoutController = require('../Controller/User/userCheckoutController')
const userOrderController = require('../Controller/User/userOrderController')
const auth = require('../Middleware/auth')
const {errorHandler} =require('../Middleware/error-middleware')

userRouter.use('/uploads', express.static('uploads'));
userRouter.use('/Public', express.static('Public'));
userRouter.use('/', express.static('Public'));

//Landing page
userRouter.get('/', auth.isUserBlocked, userController.getHomePage);


// User Login & Logout
userRouter.get('/userLogin', userController.userLogin);
userRouter.post('/postUserLogin', userController.postUserLogin)
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
// Fillter
userRouter.post('/fillter' , userProductController.postFillter)


// Wishlist view
userRouter.get('/wishlist', auth.isUserBlocked, auth.isUser, userWishlistController.getWishlist)
// Wishlist Add & Delete products
userRouter.get('/addToWishlist', auth.isUserBlocked, auth.isUser, userWishlistController.getAddToWishlist)
userRouter.get('/wishlistDelete', auth.isUserBlocked, auth.isUser, userWishlistController.getWishlistDelete)



// Profile Display
userRouter.get('/userProfile', auth.isUserBlocked, auth.isUser, userProfileController.getUserProfile)
// Address Add
userRouter.get('/addAddress', auth.isUserBlocked, auth.isUser, userProfileController.getAddAddress)
userRouter.post('/postAddAddress', auth.isUserBlocked, auth.isUser, userProfileController.postAddAddress)
// Address Delete & Edit
userRouter.get('/deleteAddress', auth.isUserBlocked, auth.isUser, userProfileController.getDeleteAddress)
userRouter.get('/editAddress', auth.isUserBlocked, auth.isUser, userProfileController.getEditAddress )
userRouter.post('/postEditAddress', auth.isUserBlocked, auth.isUser, userProfileController.postEditAddress)
// User Details Edit
userRouter.post('/postUserChangeDetails', auth.isUserBlocked, auth.isUser, userProfileController.postUserChangeDetails)


// Single Order view
userRouter.get('/orderView', auth.isUserBlocked, auth.isUser, userOrderController.getOrderView)
// Cancel & Return Signle Order 
userRouter.get('/cancelOrder', auth.isUserBlocked, auth.isUser, userOrderController.getCancelOrder)
userRouter.get('/returnOrder', auth.isUserBlocked, auth.isUser, userOrderController.getReturnOrder)



// Cart Display
userRouter.get('/cart', auth.isUserBlocked, auth.isUser, userCartController.getCart)
// Cart Add & Delete Product 
userRouter.get('/addToCart', auth.isUserBlocked, auth.isUser, userCartController.getAddToCart)
userRouter.get('/deleteCartProduct', auth.isUserBlocked, auth.isUser, userCartController.getDeleteCartProduct)
// Cart Add To Cart From Whilshlist
userRouter.get('/addToCartFromWhilshlist', auth.isUserBlocked, auth.isUser, userCartController.getAddToCartFromWhilshlist )
// Cart Quantity Decrease
userRouter.get('/decreaseCartQuantity', auth.isUserBlocked, auth.isUser, userCartController.getDecreaseCartQuantity)
userRouter.get('/increaseCartQuantity', auth.isUserBlocked, auth.isUser, userCartController.getIncreaseCartQuantity)



// Coupon Check
userRouter.get('/checkCouponCode',  auth.isUserBlocked, auth.isUser, userCartController.getCheckCouponCode )



// Checkout Display
userRouter.get('/userCheckout', auth.isUserBlocked, auth.isUser, userCheckoutController.getUserCheckout)
// Place order
userRouter.get('/placeOrder', auth.isUserBlocked, auth.isUser, userCheckoutController.getPlaceOrder)
// Confirmed Order
userRouter.get('/confirmedOrder', auth.isUserBlocked, auth.isUser, userCheckoutController.getConfirmedOrder )
// Verify Payment
userRouter.get('/verifyPayment', userCheckoutController.getVerifyPayment)


userRouter.use(errorHandler)

module.exports = userRouter;
