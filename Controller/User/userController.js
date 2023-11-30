const session = require('express-session')
const userSchema = require('../../Model/userSchema')
const ProductSchema = require('../../Model/ProductSchema')
const categorySchema = require('../../Model/categorySchema')
const walletSchema = require('../../Model/walletSchema')
const nodemailer = require('nodemailer')
const otpGenerator  = require('otp-generator')

module.exports.getHomePage = async (req,res,next)=>{
    try {
        const category = await categorySchema.find({ status : "Active" });
        const featuredProducts = await ProductSchema.find({ productStatus : "unblock" })
        const newAddedProducts  = await ProductSchema.aggregate([{$match : { productStatus : "unblock" }} ,{$sort:{createdAt:1}},{$limit:8} ])
        const popularProducts = featuredProducts.filter(product=>product.productPrice >= 50000)
        if(req.session.user){
            res.render('User/homePage',{ featuredProducts, popularProducts, newAddedProducts, category, changeLoginToProfile : true })
        }else{
            res.render('User/homePage',{ featuredProducts, popularProducts, newAddedProducts, category, changeLoginToProfile : false})
        }
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t display home page')
    }
}

module.exports.userLogin = (req,res)=>{
    if(req.session.user){
        res.redirect('/')
    }else{
        res.render('User/user-login')
    }
}

module.exports.postUserLogin = async (req,res,next)=>{
    try {
        const email = req.body.ULEmail
        const user = await userSchema.findOne({ email })
        if( user?.status === 'Inactive' ){
            res.render('User/user-login',{ blockedUser : true })
        }else if( user.password !== req.body.ULPassword ){
            res.render('User/user-login',{ invalidPassword : true })
        }else{
            req.session.user = email;
            console.log(req.session.user,'LoggedIn');
            res.redirect('/')
        }
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t login user')
    }
}

module.exports.getUserLogout = (req,res)=>{
    let userSession = req.session.user;
    req.session.destroy(async(err)=>{
        if(err){
            console.log('Error occured\n',err)
        }else{
            console.log(userSession,'Log out success');
            userSession = null;
            res.render('User/user-login',{ userLoggedout:true })
        }
    })
}

module.exports.getUserSignup = (req,res)=>{
    if(req.session.user){
        res.redirect('/')
    }else{
        res.render('User/user-emailAuth')
    }
}

module.exports.postSendOtp = async (req,res,next)=>{
    try {
        const email = req.body.USEmail
        console.log(email);
        const user = await userSchema.findOne({ email })
        if( user ){
            res.render('User/user-emailAuth',{ emailAlreadyExist : true })
        }else{
            // Generate OTP
            const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets : false });
            // Connect with smtp
            const transporter = nodemailer.createTransport({
              service : 'gmail',
              host: 'smtp.gmail.com',
              port: 587,
              secure : false,
              auth: {
                  user: process.env.MY_EMAIL_ID, // Sender gmail
                  pass: process.env.APP_PASSWORD // App password from gmail account
              }
            })

            const mailOptions = {
                from: {
                  name : 'Televisão',
                  address : process.env.MY_EMAIL_ID
                },  // sender address
                to: email, // list of receivers
                subject: "Televisão login", // Subject line
                text: "Televião login otp : " + OTP, // plain text body
                html: "<b>Televião login otp :"+ OTP + "</b>", // html body
            };

            const sendMail = async (transporter,mailOptions) => {
              try {
                await transporter.sendMail(mailOptions);
                console.log('Email has been sent!');
              } catch (error) {
                console.log(error);
              }
            }

            sendMail(transporter,mailOptions)
            
            res.render('User/user-verifyOTP',{ OTP, email })
        }
        
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t send OTP')
    }
}

module.exports.getResendOtp = async (req,res,next)=>{
    try {
        const email = req.query.email;
        // Generate OTP
        const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets : false });
        // Connect with smtp
        const transporter = nodemailer.createTransport({
          service : 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
          secure : false,
          auth: {
              user: process.env.MY_EMAIL_ID, // Sender gmail
              pass: process.env.APP_PASSWORD // App password from gmail account
          }
        })

        const mailOptions = {
            from: {
              name : 'Televisão',
              address : process.env.MY_EMAIL_ID
            },  // sender address
            to: email, // list of receivers
            subject: "Televisão login", // Subject line
            text: "Televião login otp : " + OTP, // plain text body
            html: "<b>Televião login otp :"+ OTP + "</b>", // html body
        };

        const sendMail = async (transporter,mailOptions) => {
          try {
            await transporter.sendMail(mailOptions);
            console.log('Email has been sent!');
          } catch (error) {
            console.log(error);
          }
        }

        sendMail(transporter,mailOptions)
        
        res.render('User/user-verifyOTP',{ OTP, email })
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t resend OTP')
    }
}

module.exports.postVerifyOtp = async(req,res,next)=>{
    try {
        const OTP = req.body.OTP;
        const email = req.body.email;
        if(OTP === req.body.USOtp){
            res.render('User/user-signup',{ email })
        }else{
            res.render('User/user-emailAuth',{ invalidOtp : true })
        }
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t verify OTP')
    }
}

module.exports.postUserSignup = async (req,res,next)=>{
    try {
       const data = await userSchema.findOne({email : req.body.email}) 
       if(data){
            res.render('User/user-signup',{ emailAlreadyExist:true , changeLoginToProfile : false})
       } else {
            const referralCode = otpGenerator.generate(6, { specialChars: false });
            let userData = new userSchema({
                name : req.body.USName,
                email : req.body.email,
                phnNumber : req.body.USPhnNumber,
                password : req.body.USPassword,
                referralCode,
                status : "Active"
            })        
            await userData.save();

            let wallet = new walletSchema({
                userId : req.body.email,
                amount : 0,
            })
            await wallet.save()

            
            res.redirect('/userLogin')
       }
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t signup')
    }
}

module.exports.getForgotPassword = (req,res)=>{
    res.render('User/user-forgotPassword')
}

module.exports.postSendResetPassword = async (req,res,next)=>{
    try {
        const email = req.body.ULEmail
        const user = await userSchema.findOne({ email })
        if(user){
            if( user.status === 'Inctive' ){
                res.render('User/user-login',{ blockedUser : true , changeLoginToProfile : false})
            } else {
                // Generate OTP
                const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets : false });
                // Connect with smtp
                const transporter = nodemailer.createTransport({
                  service : 'gmail',
                  host: 'smtp.gmail.com',
                  port: 587,
                  secure : false,
                  auth: {
                      user: process.env.MY_EMAIL_ID, // Sender gmail
                      pass: process.env.APP_PASSWORD // App password from gmail account
                  }
                })

                const mailOptions = {
                    from: {
                      name : 'Televisão',
                      address : process.env.MY_EMAIL_ID
                    },  // sender address
                    to: email, // list of receivers
                    subject: "Televisão login", // Subject line
                    text: "Televião login otp : " + OTP, // plain text body
                    html: "<b>Televião login otp :"+ OTP + "</b>", // html body
                };

                const sendMail = async (transporter,mailOptions) => {
                  try {
                    await transporter.sendMail(mailOptions);
                    console.log('Email has been sent!');
                  } catch (error) {
                    console.log(error);
                  }
                }

                sendMail(transporter,mailOptions)
                
                res.render('User/user-forgotOTP',{ OTP, email })
            }
        }else{
            res.render('User/user-forgotPassword',{ emailDoesNotExist : true , changeLoginToProfile : false})
        }
        
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t reset password')
    }
}

module.exports.postVerifyResetOtp = (req,res)=>{
    const OTP = req.body.OTP
    const email = req.body.email;

    if(req.body.ULOtp === OTP){
        res.render('User/user-resetPassword',{ email })
    }else{
        res.render('User/user-forgotPassword',{ invalidOTP : true })
    }
}

module.exports.postResetUserPassword = async (req,res,next)=>{
    try {
        const email = req.body.email
        const newPassword = req.body.resetPassword
        const result = await userSchema.updateOne({ email },{ password : newPassword })
        res.render('User/user-login' ,{ passwordChanged:true })
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t reset password')
    }
    
}