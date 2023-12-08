const orderSchema = require('../../Model/orderSchema')
const productSchema = require('../../Model/ProductSchema')
const dateFns = require('date-fns')

module.exports.getSalesReport = async (req,res)=>{
    try {
        const orders = await orderSchema.find({ })
            .populate({
                path : "products.productId",
                model : "product"
            })
        
        res.render('Admin/adminSalesReport',{ orders })
        
    } catch (error) {
        console.log(error);
    }
}

module.exports.getFilterReport = async (req,res)=>{
    try {
        const startDate = req.body.startDate? new Date(req.body.startDate): undefined;
        const endDate = req.body.endDate ? new Date(req.body.endDate) : undefined;
        const status = req.body.status
        
        if (startDate) startDate.setHours(0, 0, 0, 0);
        if (endDate) endDate.setHours(0, 0, 0, 0);

        let orders;
        if(status !== 'All'){
            if(startDate && endDate ){
                orders = await orderSchema.find({
                    deliveredAt: { $gte: startDate, $lte: endDate },
                    orderStatus : status
                })
            }else if(startDate){
                orders = await orderSchema.find({
                    deliveredAt: { $gte: startDate },
                    orderStatus : status
                })
            }else if(endDate){
                orders = await orderSchema.find({
                    deliveredAt: { $lte: endDate },
                    orderStatus : status
                })
            }else{
                orders = await orderSchema.find({ orderStatus : status })
            }
        }else{
            if(startDate && endDate ){
                orders = await orderSchema.find({
                    deliveredAt: { $gte: startDate, $lte: endDate },
                })
            }else if(startDate){
                orders = await orderSchema.find({
                    deliveredAt: { $gte: startDate },
                })
            }else if(endDate){
                orders = await orderSchema.find({
                    deliveredAt: { $lte: endDate },
                })
            }else{
                orders = await orderSchema.find({ })
            }
        }
        
        res.render('Admin/adminSalesReport',{ orders, status })
    } catch (error) {
        console.log(error);
    }
}