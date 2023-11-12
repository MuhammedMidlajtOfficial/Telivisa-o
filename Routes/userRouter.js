const express = require('express');
const path = require('path')
const userRouter = express.Router();
const userController = require('../Controller/User/userController');

userRouter.use('/uploads', express.static('uploads'));
userRouter.use('/Public', express.static('Public'));
userRouter.use('/', express.static('Public'));


userRouter.get('/', userController.getHomePage);
// User Login
userRouter.get('/userLogin', userController.userLogin);
userRouter.post('/postUserLogin', userController.postUserLogin);
userRouter.get('/userLogout', userController.getUserLogout);
// User Signup
userRouter.get('/userSignup', userController.getUserSignup);
userRouter.post('/postUserSignup', userController.postUserSignup);
// send otp
userRouter.post('/sendOtp',userController.postSendOtp)


module.exports = userRouter;
