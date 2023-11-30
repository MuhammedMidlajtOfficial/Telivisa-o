const mongoose = require('mongoose')

const wallet = mongoose.Schema({
    userId :{
        type : String,
        required:true
    },
    amount :{
        type:Number,
        default:0
    }
})

const walletSchema = new mongoose.model( 'wallet', wallet)

module.exports = walletSchema;