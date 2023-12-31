const cartSchema = require('../../Model/cartSchema');
const userSchema = require('../../Model/userSchema');
const wishlistSchema = require('../../Model/wishlistSchema');
const productSchema = require('../../Model/ProductSchema')
const couponSchema = require('../../Model/couponSchema')

module.exports.getCart = async (req,res,next)=>{
    try {
        const user = await userSchema.findOne({ email : req.session.user })
        const userId = user._id
        const cart = await cartSchema.findOne(
            { userId : userId })
            .populate({
                path : "products.productId",
                model : "product"
            })
        
        res.render('User/user-cart', { cart, changeLoginToProfile:true })
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t open cart')
    } 
}

module.exports.getAddToCart = async (req,res,next)=>{
    try {
        const productId = req.query.id
        const user = await userSchema.findOne({ email : req.session.user })
        const product = await productSchema.findOne({ _id : productId })
        if(!user){
            res.status(500)
        }else{
            if(product.productStock <= 0 ){
                res.status(200).json({ outOfStock:true })
            }else{
                const userId = user._id;
                let cart = await cartSchema.findOne({ userId })
                if(!cart){
                    cart = new cartSchema({
                        userId : user._id,
                        products : [{
                            productId : productId,
                            quantity : 1
                        }]
                    })
                }else{
                    let existingProduct;
                    if (cart) {
                         cart.products.forEach(element => { 
                           if(element.productId.toString() == productId.toString()){
                                existingProduct = element
                           }
                        });            
                    }
                    if(existingProduct){
                        existingProduct.quantity += 1 ;
                    }else{
                        cart.products.push({
                            productId : productId,
                            quantity : 1
                        })
                    }
                }
                await cart.save()
                res.status(200).json('Product successfully added to cart')
            }
        }
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t add product to cart')
    }
}

module.exports.getAddToCartFromWhilshlist = async (req,res,next)=>{
    try {
        const productId = req.query.id
        const user = await userSchema.findOne({ email : req.session.user })
        const userId = user._id
        const product = await productSchema.findOne({ _id : productId })
        let cart = await cartSchema.findOne({ userId })
        if(product.productStock <= 0){
            res.status(200).json({ outOfStock : true })
        }else{
            if(!cart){
                cart = new cartSchema({
                    userId : user._id,
                    products : [{
                        productId : productId,
                        quantity : 1
                    }]
                })
            }else{
                let existingProduct;
                if (cart) {
                     cart.products.forEach(element => { 
                       if(element.productId.toString() == productId.toString()){
                            existingProduct = element
                       }
                    });            
                }
                if(existingProduct){
                    existingProduct.quantity += 1 ;
                }else{
                    cart.products.push({
                        productId : productId,
                        quantity : 1
                    })
                }
    
                const user = await userSchema.findOne({ email : req.session.user})
                await wishlistSchema.updateOne({ customerId : user._id },
                { $pull:{ wishlistProducts :{ productId : productId}} })
    
            }
            await cart.save()
            res.status(200).json('Product successfully added to cart')
        }
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t add product to cart')
    }
}

module.exports.getDeleteCartProduct = async (req,res,next)=>{
    try {
        const productId = req.query.id;
        const user = await userSchema.findOne({ email : req.session.user })
        await cartSchema.updateOne(
            { userId : user._id },
            { $pull:{ products:{ productId } } }
        )
        res.redirect('/cart')
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t add product to cart')
    }
    
}

module.exports.getDecreaseCartQuantity = async (req,res,next)=>{
    try {
        const productId = req.query.id;
        const user = await userSchema.findOne({ email : req.session.user })
        const userId = user._id
        let cart = await cartSchema.findOne({userId:userId}).populate({
            path : "products.productId",
            model : "product"
        })

        let existingProduct;
        if (cart) {
             cart.products.forEach(element => { 
               if(element.productId._id.toString() == productId.toString()){
                    existingProduct = element
               }
            });            
        }

        existingProduct.quantity += -1 ;
        const updatedQty=existingProduct.quantity;
        await cart.save()

        const subTotal = +existingProduct.productId.productPrice * existingProduct.quantity

        res.status(200).json({subTotal, updatedQty});
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t decrement quantity of product from cart')
    }
}

module.exports.getIncreaseCartQuantity = async (req,res,next)=>{
    try {
        const productId = req.query.id;
        const user = await userSchema.findOne({ email : req.session.user })
        const userId = user._id
        let cart = await cartSchema.findOne({userId:userId}).populate({
            path : "products.productId",
            model : "product"
        })

        const product = await productSchema.findOne({ _id : productId })
        

        let existingProduct;
        if (cart) {
             cart.products.forEach(element => { 
               if(element.productId._id.toString() == productId.toString()){
                    existingProduct = element
               }
            });            
        }

        existingProduct.quantity += 1 ;

        const currentQty = product.productStock;
        const currentProduct = product.productName;
        if(currentQty >= existingProduct.quantity){
            const updatedQty=existingProduct.quantity;
            await cart.save()
    
            const subTotal = +existingProduct.productId.productPrice * existingProduct.quantity
            res.status(200).json({subTotal, updatedQty});
        }else{
            res.status(200).json({ currentQty, currentProduct })
        }
        
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t increment quantity of product from cart')
    }
}

module.exports.getCheckCouponCode = async (req,res,next)=>{
    try {
        const couponCode = req.query.couponCode;
        let grandTotal = req.query.grandTotal;
        const user =  await userSchema.findOne({ email : req.session.user })

        const coupon = await couponSchema.findOne({ couponCode, status:'Active' })
        if(!coupon){
            return res.status(200).json({ InvalidCouponCode:true })
        }else if(grandTotal < coupon.minPrice){
            return res.status(200).json({ minPrice:true })
        }else{
            coupon.radeemedUsers.forEach((redeemed)=>{
                if(String(redeemed) === String(user._id)){
                    return res.status(200).json({ alreadyRadeemed:true })
                }
            })
            const couponAmount = coupon.amount
            totalAmount = grandTotal - coupon.amount
            return res.status(200).json({ totalAmount, couponAmount, couponCode, success:true })
        }
        
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t add coupon')
    }
}