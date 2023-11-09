const mongoose = require('mongoose')

const category = mongoose.Schema({
    categoryName :{
        type:String,
        required:true
    },
    status :{
        type:String,
        required:true
    }
})

const categorySchema = new mongoose.model('category',category)

module.exports = categorySchema;