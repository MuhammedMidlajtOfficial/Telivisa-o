const mongoose = require('mongoose')

const admin = mongoose.Schema({
    email:{
        type:String
    },
    password:{
        type:String
    }
}, {timestamps: true})

const adminLoginSchema = new mongoose.model('adminLogin',admin)

module.exports = adminLoginSchema;