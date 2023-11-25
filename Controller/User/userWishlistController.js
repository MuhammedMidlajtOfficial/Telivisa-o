const ProductSchema = require('../../Model/ProductSchema')
const wishlistSchema = require('../../Model/wishlistSchema')
const userSchema = require('../../Model/userSchema')

module.exports.getWishlist = async (req,res,next)=>{
    try {
        const user = await userSchema.findOne({ email : req.session.user })
        const wishlistProducts = await wishlistSchema.findOne(
            { customerId : user._id })
            .populate({
                path:'wishlistProducts.productId',
                model:'product'
            })
        const products = wishlistProducts.wishlistProducts
        res.render('User/user-wishlist',{ products, changeLoginToProfile:true })
    } catch (error) {
        console.log(error);
        next('There is an error occured , can\'t get wishlist')
    }
}

module.exports.getAddToWishlist = async (req,res,next)=>{
    try {
        const ProductId = req.query.id;
        const user = await userSchema.findOne({ email : req.session.user })
        const existingUser = await wishlistSchema.findOne({ customerId : user._id })

        if(existingUser){
            const existingProduct = existingUser.wishlistProducts.find((product)=>{
                return product.productId.toString() === ProductId
            })
            
            if (existingProduct) {
                console.log("Product already exist in wish list");
                 res.status(200).json({productExist:true})
            }else{  
                await wishlistSchema.updateOne({ customerId : user._id },{$push:{ wishlistProducts:{productId : ProductId }}})
                res.status(200).json('Added to wishlist')
            }
        }else{
            const wishlist = await new wishlistSchema( {
                customerId : user._id,
                wishlistProducts : [{ productId : ProductId }]
            })
            await wishlist.save();
            res.status(200).json({data:'Added to wishlist'})
        }
    } catch (error) {
        console.log(error);
        next('There is an error occured , can\'t add product to wishlist')
    }
}

module.exports.getWishlistDelete = async (req,res,next)=>{
    try {
        const productId = req.query.id;
        const user = await userSchema.findOne({ email : req.session.user})
        await wishlistSchema.updateOne({ customerId : user._id },
            { $pull:{ wishlistProducts :{ productId : productId}} })
        res.redirect('/wishlist')
    } catch (error) {
        console.log(error);
        next('There is an error occured , can\'t delete product from wishlist')
    }
}