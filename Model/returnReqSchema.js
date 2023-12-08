const mongoose = require('mongoose')

const returnReq = mongoose.Schema({
    orderId :{
        type : mongoose.Schema.Types.ObjectId,
        ref:'orderSchema'
    },
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userSchema'
    },
    reqStatus:{
        type:String,
        required:true
    },
},{timestamps: true})

const returnReqSchema = new mongoose.model( 'returnReq', returnReq )

module.exports = returnReqSchema;