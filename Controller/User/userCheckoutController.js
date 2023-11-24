const userSchema = require('../../Model/userSchema')
const cartSchema = require('../../Model/cartSchema')
const addressSchema = require('../../Model/addressSchema')
const orderSchema = require('../../Model/orderSchema')
const productSchema = require('../../Model/ProductSchema')


module.exports.getUserCheckout = async (req,res,next)=>{
    try {
        const user = await userSchema.findOne({ email : req.session.user })
        const userId = user._id
        const cart = await cartSchema.findOne(
            { userId : userId })
            .populate({
                path : "products.productId",
                model : "product"
            })
        if(cart.products.length){
            const addressObj = await addressSchema.findOne({ userId })
            res.render('User/user-checkout',{ cart, addressObj , changeLoginToProfile:true })
        }else{
            res.redirect('/cart')
        }
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t open checkout')
    }
}

module.exports.getPlaceOrder = async (req,res,next)=>{
    try {
        const user = await userSchema.findOne({ email : req.session.user })
        const userId = user._id
        const addressId = req.query.addressId;
        const paymentMethod = req.query.paymentMethod;
        const couponCode = req.query.couponCode;
        const totalAmount = req.query.totalAmount;

        const cart = await cartSchema.findOne({ userId : userId })
        const addressObj = await addressSchema.findOne({ userId})
        const popCart = await cartSchema.findOne(
            { userId : userId })
            .populate({
                path : "products.productId",
                model : "product"
            })

        let productsArr = [];
        for(let i=0;i<cart.products.length;i++){
            if(popCart.products[i].productId._id.toString() === cart.products[i].productId.toString() ){
                productsArr.push({
                    productId : cart.products[i].productId,
                    productPrice : popCart.products[i].productId.productPrice,
                    quantity : cart.products[i].quantity
                })
            } 
        }
        
        let address;
        addressObj.address.forEach(addr => {
            if( addr._id.toString() === addressId ) {
                address = addr;
            }
        });

        let order;
        if(couponCode.length){
            order = new orderSchema({
                userId,
                products : productsArr,
                totalAmount ,
                couponCode,
                paymentMethod,
                address,
                orderStatus : 'Placed'
            })
        }else{
            order = new orderSchema({
                userId,
                products : productsArr,
                totalAmount ,
                paymentMethod,
                address,
                orderStatus : 'Placed'
            })
        }
        
        await order.save();
    
        cart.products.forEach( async (product)=>{
            try {
                await productSchema.updateOne(
                    { _id : product.productId },{ $inc :{ productStock : -product.quantity }}
                )
            } catch (error) {
                console.log(error);
                next('There is an error occured, Cant\'t decrease product stock')
            }
        })
    
        cart.products = [];
        await cart.save()
    
        res.status(200).json('Order placed Successfully')

    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t place order')
    }
}

module.exports.getConfirmedOrder = (req,res)=>{
    res.render('User/user-confirmedOrder',{ changeLoginToProfile:true })
}