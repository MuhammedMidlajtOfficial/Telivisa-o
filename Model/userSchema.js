const mongoose = require('mongoose')

const user = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phnNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default : 'Active'
    }
}, {timestamps: true})

const userSchema = new mongoose.model('userData',user)

module.exports = userSchema