const orderSchema = require('../../Model/orderSchema')
const userSchema = require('../../Model/userSchema')


module.exports.getAdminOrders = async (req,res) => {
    const orders = await orderSchema.find({});
    res.render('Admin/adminOrders',{orders})
}

module.exports.getAdminViewOrder = async (req,res) => {
    const orderId = req.query.id;
    const order = await orderSchema.findOne(
        { _id : orderId})
        .populate({
            path : "products.productId",
            model : "product"
        })
    res.render('Admin/adminViewOrder',{ order })
}

module.exports.postAdminUpdateOrderStatus = async (req,res) => {
    const orderId = req.query.id;
    const orderStatus = req.body.productStatus;
    await orderSchema.updateOne({ _id : orderId},{ orderStatus })
    const order = await orderSchema.findOne(
        { _id : orderId})
        .populate({
            path : "products.productId",
            model : "product"
        })
    res.render('Admin/adminViewOrder',{ order })
}
