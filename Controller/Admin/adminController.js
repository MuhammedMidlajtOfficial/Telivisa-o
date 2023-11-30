const adminLoginSchema = require('../../Model/adminLoginSchema')
const orderSchema = require('../../Model/orderSchema')
const productSchema = require('../../Model/ProductSchema')
const userSchema = require('../../Model/userSchema')
const {generateChart} = require('../../Helper/generateChart')

module.exports.getAdminLogin = (req,res)=>{
    if(req.session.admin){
        res.redirect('/admin/adminDashboard')
    }else{
        res.render('Admin/adminLogin')
    }
}

module.exports.postAdminLogin = async (req,res)=>{
    try{
        const admin = await adminLoginSchema.findOne({email : req.body.ALEmail })
        if(admin){
            if(admin.password === req.body.ALPassword){
                req.session.admin = req.body.ALEmail;
                
                res.redirect('/admin/adminDashboard')
                console.log('Admin logged in');
            }else{
                res.render('Admin/adminLogin',{ emailDoesNotExist : true })
            }
        }else{
            res.render('Admin/adminLogin',{ emailDoesNotExist : true })
        }
    }catch (error) {
        console.log(error);
    }
}

module.exports.getadminLogout = (req,res)=>{
    req.session.destroy((err)=>{
        if (err) {
            console.log(err);
        } else {
            console.log('Admin log out successfull');
            res.render('Admin/adminLogin',{ adminLogout : true })
        }
    })
}

module.exports.getAdminDashboard = async (req,res)=>{
    try {
        const total = await orderSchema.aggregate([{ $match : { paymentStatus : "Success" } },{ $group :{ _id: null , total: { $sum: '$totalAmount' } }}]);
        const revenue = total[0].total;
        const orders = await orderSchema.find({ orderStatus : "Delivered" }).count()
        const product = await productSchema.find({}).count()
        const latestOrders = await orderSchema.find({}).sort({ createdAt: -1 }).limit(5)
        const users = await userSchema.find({}).sort({ createdAt: -1 }).limit(4)
        const monthlyOrders = await orderSchema.aggregate([
            { $match: { createdAt: { $exists: true },paymentStatus : "Success"} },
            { $project: { 
                yearMonth: { $dateToString: { format: '%m/%Y', date: '$createdAt' }},
                totalAmount: '$totalAmount' }},
            { $group: { _id: '$yearMonth', monthlySales: { $sum: '$totalAmount' }} },
            { $sort: { _id: -1 }}
        ]);

        const totalSales = await orderSchema.find({ paymentStatus : "Success" });
        const { yearlySales, monthlySales, weeklySales } = generateChart(totalSales);
        res.render('Admin/adminDashboard',
            {   revenue, 
                orders, 
                product, 
                latestOrders, 
                users, 
                monthlyOrders, 
                yearlySales,
                monthlySales,
                weeklySales
            })
    } catch (error) {
        console.log(error);
    }
}

