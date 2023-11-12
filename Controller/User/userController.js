const session = require('express-session')
const userSchema = require('../../Model/userSchema')
const ProductSchema = require('../../Model/ProductSchema')
const sweetAlert = require('sweetalert')
const nodemailer = require('nodemailer')
const otpGenerator  = require('otp-generator')
require('dotenv').config()

module.exports.getHomePage = async (req,res)=>{
    const featuredProducts = await ProductSchema.find({})
    if(req.session.user){
        res.render('User/homePage',{ featuredProducts, changeLoginToProfile : true })
    }else{
        res.render('User/homePage',{ featuredProducts, changeLoginToProfile : false})
    }
}

module.exports.userLogin = (req,res)=>{
    res.render('User/user-login')
}

module.exports.postSendOtp = async (req,res)=>{
    try {
        const user = await userSchema.findOne({ email : req.body.ULEmail , status : 'Active'})
        if(user){
            // Generate OTP
            const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets : false });
            const UserMail = req.body.ULEmail;
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
                to: UserMail, // list of receivers
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
            sweetAlert('OTP has been sent!');

            res.render('User/user-login',{ UserMail , OTP  , UserLogin:true})
        }else{
            res.render('User/user-login',{ emailDoesNotExist : true , changeLoginToProfile : false})
        }
        
    } catch (error) {
        console.log(error);
    }
}

module.exports.postUserLogin = async(req,res)=>{
    try {
        const OTP = req.body.OTP;
        if(OTP === req.body.ULOtp){
            req.session.user = req.body.UserMail;
            console.log(req.session.user,'LoggedIn');
            res.redirect('/')
        }else{
            res.render('User/user-login',{ invalidOtp : true , changeLoginToProfile : false})
        }
    } catch (error) {
        console.log(error);
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
            res.redirect('/')
        }
    })
}

module.exports.getUserSignup = (req,res)=>{
    res.render('User/user-signup',{ changeLoginToProfile : false})
}

module.exports.postUserSignup = async (req,res)=>{
    try {
       const data = await userSchema.findOne({email : req.body.USEmail}) 
       if(data){
            res.render('User/user-signup',{ emailAlreadyExist:true , changeLoginToProfile : false})
       } else {
            let userData = new userSchema({
                name : req.body.USName,
                email :req.body.USEmail,
                phnNumber : req.body.USPhnNumber,
                password : req.body.USPassword,
                status : "Active"
            })        
            await userData.save();
            res.redirect('/userLogin')
       }
    } catch (error) {
        console.log(error);
    }
}

