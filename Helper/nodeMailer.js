const nodemailer = require('nodemailer')
const  otpGenerator  = require('otp-generator')
const userController = require('../Controller/User/userController')
require('dotenv').config()

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

console.log(userController.emailId);

const mailOptions = {
    from: {
      name : 'Televisão',
      address : process.env.MY_EMAIL_ID
    },  // sender address
    to: userController.emailId, // list of receivers
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



module.exports = {
  transporter,
  mailOptions,
  sendMail,
  OTP
};