const mongoose = require('mongoose')

const admin = mongoose.Schema({
    email:{
        type:String
    },
    password:{
        type:String
    }
})

const adminLoginSchema = new mongoose.model('adminLogin',admin)

module.exports = adminLoginSchema;