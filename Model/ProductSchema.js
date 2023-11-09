const mongoose = require('mongoose')

const product = mongoose.Schema({
    productName :{
        type:String,
        required:true
    },
    productBrand :{
        type:String,
        required:true
    },
    productSize :{
        type:String,
        required:true
    },
    productResolution :{
        type:String,
        required:true
    },
    productStock :{
        type:Number,
        required:true
    },
    productCategory :{
        type:String,
        required:true
    },
    productDescription :{
        type:String,
        required:true
    },
    productPrice :{
        type:Number,
        required:true
    },
    productPromoPrice :{
        type:Number,
        required:true
    },
    imageUrl :{
        type:Array,
        required:true
    },
    productStatus :{
        type:String,
        required:true
    }
})

const ProductSchema = new mongoose.model('product',product)

module.exports = ProductSchema