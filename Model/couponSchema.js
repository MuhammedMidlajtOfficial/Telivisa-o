const mongoose = require('mongoose')

const Coupon = mongoose.Schema({
    couponCode :{
        type : String,
        required:true
    },
    amount :{
        type : Number,
        required : true
    },
    minPrice :{
        type : Number,
        required : true
    },
    maxPrice :{
        type : Number
    },
    expiryDate :{
        type : Date,
        required:true
    },
    status :{
        type : String,
        required:true
    },
    radeemedUsers :[{
        userId :{
            type : String,
        }
    }],
    eligibleUsers :[{
        userId :{
            type : String,
        }
    }]
})

const couponSchema = new mongoose.model('coupon',Coupon)

module.exports = couponSchema