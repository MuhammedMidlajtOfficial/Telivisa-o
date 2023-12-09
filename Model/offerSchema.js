const mongoose = require('mongoose')

const offer = mongoose.Schema({
    OfferName :{
        type:String,
        required:true
    },
    OfferType :{
        type:String,
        required:true
    },
    amount :{
        type:Number,
        required:true
    },
    minPrice :{
        type:Number,
        required:true
    },
    maxPrice :{
        type:Number,
    },
    expiryDate :{
        type:Date,
        required:true
    },
    status :{
        type:String,
        required:true
    },
},{ timestamps:true })

const offerSchema = new mongoose.model('offer', offer);

module.exports = offerSchema