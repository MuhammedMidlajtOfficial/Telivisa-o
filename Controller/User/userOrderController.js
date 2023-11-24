const orderSchema = require('../../Model/orderSchema')
const userSchema = require('../../Model/userSchema')
const productSchema = require('../../Model/ProductSchema')
const cartSchema = require('../../Model/cartSchema')
const addressSchema = require('../../Model/addressSchema')

module.exports.getOrderView = async (req,res,next)=>{
    try {
        const orderId = req.query.orderId;
        const order = await orderSchema.findOne(
            { _id : orderId})
            .populate({
                path : "products.productId",
                model : "product"
            })
    
        res.render('User/user-orderView',{ order, changeLoginToProfile:true })
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t display order view page')
    }
}

module.exports.getCancelOrder = async (req,res,next)=>{
    try {
        const id = req.query.id;
        await orderSchema.updateOne({ _id : id },{ orderStatus : 'Cancelled' })
        res.status(200).json('Order cancelled')
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t cancel ordered product')
    }
}

module.exports.getReturnOrder = async (req,res,next)=>{
    try {
        const id = req.query.id;
        await orderSchema.updateOne({ _id : id },{ orderStatus : 'Returned' })
        res.status(200).json('Order Returned')
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t return ordered product')
    }
}