const orderSchema = require('../../Model/orderSchema')
const userSchema = require('../../Model/userSchema')
const returnReqSchema = require('../../Model/returnReqSchema')
const productSchema = require('../../Model/ProductSchema')
const walletSchema = require('../../Model/walletSchema')


module.exports.getAdminOrders = async (req,res) => {
    try{
        const orders = await orderSchema.find({}).sort({ createdAt: -1 });
        res.render('Admin/adminOrders', { orders });

    }catch (error) {
        console.log(error);
    }
}

module.exports.getAdminViewOrder = async (req,res) => {
    try{
        const orderId = req.query.id;
        const order = await orderSchema.findOne(
            { _id : orderId})
            .populate({
                path : "products.productId",
                model : "product"
            })
        res.render('Admin/adminViewOrder',{ order })
    }catch (error) {
        console.log(error);
    }
}

module.exports.postAdminUpdateOrderStatus = async (req,res) => {
    try{
        const orderId = req.query.id;
        const orderStatus = req.body.productStatus;
        if(orderStatus === 'Delivered'){
            const deliveredAt = Date.now()
            await orderSchema.updateOne({ _id : orderId},{ orderStatus , paymentStatus : "Success",deliveredAt })

        }
        await orderSchema.updateOne({ _id : orderId},{ orderStatus })
        const order = await orderSchema.findOne(
            { _id : orderId})
            .populate({
                path : "products.productId",
                model : "product"
            })
        return res.render('Admin/adminViewOrder',{ order })
    }catch (error) {
        console.log(error);
    }
}

module.exports.getAdminOrderCancel = async (req,res) =>{
    const orderId = req.query.id;
    const order = await orderSchema.findOne(
        { _id : orderId })
        .populate({
            path : "products.productId",
            model : "product"
        })
    if (order.orderStatus === 'Pending' || order.orderStatus === 'Shipped') {
        if(order.paymentStatus === 'Success'){
            await walletSchema.updateOne({ userId : order.userId },{ $push:{
                walletHistory:{
                    amount : order.totalAmount,
                    status : 'Credit',
                    whereFrom : 'Cancell product - ' + order.products[0].productId.productName,
                    whereFromId : order._id
                }
             }, $inc :{ 
                amount : order.totalAmount
             } })

            await orderSchema.updateOne({ _id : orderId },{ orderStatus : 'Cancelled', paymentStatus : 'Refunded' })

        }else{
            await orderSchema.updateOne({ _id : orderId },{ orderStatus : 'Cancelled', paymentStatus : 'Failed' })
        }
    }
    return res.render('Admin/adminViewOrder',{ order })
}

module.exports.getReturnReq = async (req,res) =>{
    try {
        const returnReq = await returnReqSchema.find({})
            .populate({
                path:'userId',
                model:'userData'
            }).sort({ createdAt : -1 })
        res.render('Admin/adminReturnReq',{ returnReq })
    } catch (error) {
        console.log(error);
    }
} 

module.exports.getRequestAccept = async (req,res) =>{
    try {
        const reqId = req.query.id;
        const returnOrder = await returnReqSchema.findOne({ _id : reqId })
        const id = returnOrder.orderId;
        const user = await userSchema.findOne({ _id : returnOrder.userId })

        await orderSchema.updateOne({ _id : id },{ orderStatus : 'Returned' })
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
            const userId = user._id
            await walletSchema.updateOne({ userId },{ $inc :{ amount : order.totalAmount } })
            await orderSchema.updateOne({ _id : id },{ paymentStatus : 'Refunded' })

            await walletSchema.updateOne({ userId },{ $push:{
                walletHistory:{
                    amount : order.totalAmount,
                    status : 'Credit',
                    whereFrom : 'Return product - ' + order.products[0].productId.productName,
                    whereFromId : order._id
                }
            }
            })
        }

        await returnReqSchema.updateOne({ _id : reqId },{ reqStatus : 'Accepted' }) 
        res.redirect('/admin/adminReturnReq')
    } catch (error) {
        console.log(error);
    }
} 

module.exports.getRequestReject = async (req,res) =>{
    const reqId = req.query.id;
    await returnReqSchema.updateOne({ _id : reqId },{ reqStatus : 'Rejected' }) 
    res.redirect('/admin/adminReturnReq')
}
