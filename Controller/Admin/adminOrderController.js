const orderSchema = require('../../Model/orderSchema')
const userSchema = require('../../Model/userSchema')


module.exports.getAdminOrders = async (req,res) => {
    try{
        const orders = await orderSchema.find({}).sort({ createdAt: -1 })
        res.render('Admin/adminOrders',{orders})
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
        res.render('Admin/adminViewOrder',{ order })
    }catch (error) {
        console.log(error);
    }
}
