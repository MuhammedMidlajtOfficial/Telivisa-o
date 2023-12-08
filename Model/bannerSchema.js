const mongoose = require('mongoose')

const banner = new mongoose.Schema({
    mainTitle :{
        type:String,
        required:true
    },
    subTitle :{
        type:String,
        required:true
    },
    image :{
        type:Array,
        required:true
    },
    offers :{
        type:String,
        required:true
    },
    offerType :{
        type:String,
        required:true
    },
    expiryDate :{
        type:String,
        required:true
    },
    status :{
        type:String,
        required:true
    }
},{ timestamps : true })

const bannerSchema = new mongoose.model('Banner',banner)

module.exports = bannerSchema;