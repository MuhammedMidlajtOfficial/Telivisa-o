const orderSchema = require('../../Model/orderSchema')
const userSchema = require('../../Model/userSchema')
const productSchema = require('../../Model/ProductSchema')
const cartSchema = require('../../Model/cartSchema')
const addressSchema = require('../../Model/addressSchema')
const walletSchema = require('../../Model/walletSchema')
const returnReqSchema = require('../../Model/returnReqSchema')

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
        const user = await userSchema.findOne({ email : req.session.user })
        await orderSchema.updateOne({ _id : id },{ orderStatus : 'Cancelled' })
        const order = await orderSchema.findOne({ _id : id })
            .populate({
                path : "products.productId",
                model : "product"
            })

        order.products.forEach( async (product)=>{
            try {
                await productSchema.updateOne(
                    { _id : product.productId },{ $inc :{ productStock : product.quantity }}
                )
            } catch (error) {
                console.log(error);
                next('There is an error occured, Cant\'t add product stock')
            }
        })


        if(order.paymentStatus === 'Success'){
            const userId = user._id.toString()
            await walletSchema.updateOne({ userId },{ $push:{
                walletHistory:{
                    amount : order.totalAmount,
                    status : 'Credit',
                    whereFrom : 'Cancel product - ' + order.products[0].productId.productName,
                    whereFromId : order._id
                }
            }
            })
            await walletSchema.updateOne({ userId },{ $inc :{ amount : order.totalAmount } })
            await orderSchema.updateOne({ _id : id },{ paymentStatus : 'Refunded' })
        }
        res.status(200).json('Order cancelled')
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t cancel ordered product')
    }
}

module.exports.getReturnOrder = async (req,res,next)=>{
    try {
        const orderId = req.query.id;
        const user = await userSchema.findOne({ email : req.session.user })
        const returnReq = await new returnReqSchema({
            orderId,
            userId : user._id,
            reqStatus : 'Pending'
        })

        returnReq.save();      
        res.status(200).json('Order return request send')
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t return ordered product')
    }
}