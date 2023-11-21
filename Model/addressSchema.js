const mongoose = require('mongoose')

const address = mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        required:true
    },
    address : [{
        name : {
            type : String,
            required:true
        },
        email :{
            type : String,
            required:true
        },
        phnNumber :{
            type : Number,
            required:true
        },
        alterPhnNumber :{
            type : Number,
            required:true
        },
        street :{
            type : String,
            required:true
        },
        city :{
            type : String,
            required:true
        },
        state :{
            type : String,
            required:true
        },
        pinCode :{
            type : Number,
            required:true
        }
    }]
    
})

const addressSchema = new mongoose.model('Address' , address)

module.exports = addressSchema;