const mongoose = require('mongoose')

const wallet = mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userSchema'
    },
    amount :{
        type:Number,
        required:true
    }
})

const walletSchema = new mongoose.model( 'wallet', wallet)

module.exports = walletSchema;