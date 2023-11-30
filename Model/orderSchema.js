const mongoose = require('mongoose')

const order = mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userSchema'
    },
    products :[{
        productId :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'ProductSchema',
        },
        productPrice :{
            type : Number,
            required:true
        },
        quantity :{
            type : String,
            required:true
        },
    }],
    totalAmount :{
        type : Number,
        required:true
    },
    couponCode :{
        type : String,
    },
    paymentMethod :{
        type : String,
        required:true
    },
    address :{
        type : Object,
        required:true
    },
    orderStatus :{
        type : String,
        required:true
    },
    paymentStatus :{
        type : String,
        required:true
    },
    deliveredAt :{
        type:Date
    }
},{ timestamps : true })

const orderSchema = new mongoose.model( 'order' , order )

module.exports = orderSchema;