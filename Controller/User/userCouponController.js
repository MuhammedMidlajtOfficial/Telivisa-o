const couponSchema = require('../../Model/couponSchema')
const moment = require('moment')

module.exports.getShowCoupon = async (req,res,next)=>{
    try {
        const coupons = await couponSchema.find();
        res.render('User/user-coupon',{ coupons, moment: moment })
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t display coupon page')
    }
}