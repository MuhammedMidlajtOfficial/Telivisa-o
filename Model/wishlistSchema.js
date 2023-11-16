const mongoose = require('mongoose')

const wishlist = {
    customerId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userSchema'
    },
    wishlistProducts :[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"ProductSchema"
        }
    }]
}

const userWishlistSchema = new mongoose.model('wishlist', wishlist)

module.exports = userWishlistSchema;