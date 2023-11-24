const mongoose = require('mongoose')

const cart = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userSchema'
    },
    products : [{
        productId :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'ProductSchema'
        } ,
        quantity :{
            type : Number,
            required:true
        }
    }]
})

const cartSchema = new mongoose.model( 'cart' , cart )

module.exports = cartSchema;