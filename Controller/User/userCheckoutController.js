const userSchema = require('../../Model/userSchema')
const cartSchema = require('../../Model/cartSchema')
const addressSchema = require('../../Model/addressSchema')
const orderSchema = require('../../Model/orderSchema')
const productSchema = require('../../Model/ProductSchema')
const couponSchema = require('../../Model/couponSchema')
const offerSchema = require('../../Model/offerSchema')
const razorpayHelper = require('../../Helper/razorpayHelper')
const { response } = require('express')


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
        
        let outOfStockArr = []
        let count = 0;
        cart.products.forEach((product)=>{
            if( product.quantity > product.productId.productStock ){
                outOfStockArr.push(product.productId)
                count = 1
            }
        })
        

        if(cart.products.length){
            const offers = await offerSchema.find({ status : 'Active' })
            let offerAmount = 0;
            for(let i=0;i<cart.products.length;i++){
                for(let j=0;j<offers.length;j++){
                    if(cart.products[i].productId.productBrand === offers[j].OfferName){
                        if(cart.products[i].productId.productPrice * cart.products[i].quantity > offers[j].minPrice ){
                            offerAmount = offerAmount + offers[j].amount
                        }
                    }
                }
            }
            const addressObj = await addressSchema.findOne({ userId })

            if(count){
                return res.render('User/user-cart',{ cart, offerAmount, addressObj , changeLoginToProfile:true, outOfStockArr , outofStock:true })
            }else{
                res.render('User/user-checkout',{ cart, offerAmount, addressObj , changeLoginToProfile:true })
            }
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
        const discount = req.query.discount;

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
                const productId = cart.products[i].productId;
                const productDetails = await productSchema.findOne({ _id : productId })
                if( productDetails.productStatus === 'block' ){
                    return res.status(200).json({ productNotExist : true })
                }else{
                    if( cart.products[i].quantity <= productDetails.productStock ){
                        productsArr.push({
                            productId : cart.products[i].productId,
                            productPrice : popCart.products[i].productId.productPrice,
                            quantity : cart.products[i].quantity
                        })
                    }else{
                        return res.status(200).json({ outOfStock : true })
                    }
                }
            } 
        }

        let address;
        addressObj.address.forEach(addr => {
            if( addr._id.toString() === addressId ) {
                address = addr;
            }
        });

        if(paymentMethod === 'Cash on delivery'){
            
            let order;
            if(couponCode){
                order = new orderSchema({
                    userId,
                    products : productsArr,
                    totalAmount ,
                    couponCode,
                    paymentMethod,
                    address,
                    discount,
                    orderStatus : 'Placed',
                    paymentStatus : 'Pending'
                })
            }else{
                order = new orderSchema({
                    userId,
                    products : productsArr,
                    totalAmount ,
                    paymentMethod,
                    address,
                    discount,
                    orderStatus : 'Placed',
                    paymentStatus : 'Pending'
                })
            }
            await order.save();

            // Add user to Radeemed
            if(couponCode){
                console.log('here');
                await couponSchema.updateOne({ couponCode },{ $push:{ radeemedUsers : userId } })
            }

            // Decrease stock
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
        }else if(paymentMethod === 'Online payment'){
            let order;
            if(couponCode.length){
                order = new orderSchema({
                    userId,
                    products : productsArr,
                    totalAmount ,
                    couponCode,
                    paymentMethod,
                    address,
                    discount,
                    orderStatus : 'Failed',
                    paymentStatus : 'Failed'
                })
            }else{
                order = new orderSchema({
                    userId,
                    products : productsArr,
                    totalAmount ,
                    paymentMethod,
                    address,
                    discount,
                    orderStatus : 'Failed',
                    paymentStatus : 'Failed'
                })
            }
            await order.save();
        }
        
        const userOrders = await orderSchema.find({ userId }).sort({ createdAt:-1 })
        const latestOrderId = userOrders[0]._id
        //RAZORPAY  
        if(paymentMethod === 'Online payment'){
            razorpayHelper.generateRazorpay(latestOrderId,totalAmount).then((order)=>{
                res.status(200).json({order})
            })
        }else{
            res.status(200).json({ codSuccess : true })
        }
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t place order')
    }
}

module.exports.getConfirmedOrder = (req,res)=>{
    res.render('User/user-confirmedOrder',{ changeLoginToProfile:true })
}

module.exports.getVerifyPayment = async (req,res,next)=>{
    try {
        const paymentId = req.query.paymentId
        const orderId = req.query.orderId
        const user = await userSchema.findOne({ email : req.session.user })
        const userId = user._id
        const cart = await cartSchema.findOne({ userId })
        if(paymentId){
            await orderSchema.updateOne({ _id : orderId },{ $set:{ paymentStatus : "Success", orderStatus : 'Placed' }})
            res.status(200).json('Payment success')
            // Decrease stock
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
        }else{
            res.status(500).json('Error , Payment failed')
        }
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t do payment')
    }
}