const { add } = require('date-fns')
const couponSchema = require('../../Model/couponSchema')


// Fuctions
async function addCoupon( couponCode, amount, minPrice, maxPrice, expiryDate, status ){
    let coupon;
        if (maxPrice) {
            coupon = await new couponSchema({
                couponCode,
                amount,
                minPrice,
                maxPrice,
                expiryDate,
                status 
            })
        }else{
            coupon = await new couponSchema({
                couponCode,
                amount,
                minPrice,
                expiryDate,
                status 
            })
        }

    coupon.save()
}



module.exports.getAdminCoupon = async (req,res) => {
    try {
        const timestamp = Date.now();
        const date = new Date(timestamp).toISOString().split('T')[0];
        const coupons = await couponSchema.find({ })
        res.render('Admin/adminCoupon',{ coupons, date })
    } catch (error) {
        console.log(error);
    }
}

module.exports.postAdminAddCoupon = async (req,res) => {
    try {
        const couponCode = req.body.couponCode;
        const amount = req.body.couponAmount;
        const minPrice = req.body.minPrice;
        const maxPrice = req.body.maxPrice;
        const expiryDate = req.body.expiryDate;
        const status = req.body.couponStatus;
    
        addCoupon( couponCode, amount, minPrice, maxPrice, expiryDate, status )
        res.redirect('/admin/adminCoupon')
    } catch (error) {
        console.log(error);
    }
}

module.exports.postAdminEditCoupon = async (req,res) => {
    try {
        const couponCode = req.body.couponCode;
        const amount = req.body.couponAmount;
        const minPrice = req.body.minPrice;
        const maxPrice = req.body.maxPrice;
        const expiryDate = req.body.expiryDate;
        const status = req.body.couponStatus;
    
        if (maxPrice) {
            await couponSchema.updateOne({
                couponCode,
                amount,
                minPrice,
                maxPrice,
                expiryDate,
                status 
            })
        }else{
            await couponSchema.updateOne({
                couponCode,
                amount,
                minPrice,
                expiryDate,
                status 
            })
        }

        res.redirect('/admin/adminCoupon')
    } catch (error) {
        console.log(error);
    }
}

module.exports.getAdminBlockCoupon = async (req,res) => {
    try {
        const id = req.query.id;
        await couponSchema.updateOne({ _id : id },{ $set:{ status : 'Inactive' }})
        res.redirect('/admin/adminCoupon')
    } catch (error) {
        console.log(error);
    }
}

module.exports.getAdminUnblockCoupon = async (req,res) => {
    try {
        const id = req.query.id;
        await couponSchema.updateOne({ _id : id },{ $set:{ status : 'Active' }})
        res.redirect('/admin/adminCoupon')
    } catch (error) {
        console.log(error);
    }
}

module.exports.getAdminEditCoupon = async (req,res) => {
    try {
        const id = req.query.id;
        const coupons = await couponSchema.find({ })
        const SelectedCoupon = await couponSchema.findOne({ _id : id })
        res.render('Admin/adminCoupon',{ coupons,SelectedCoupon, editCoupon:true})
    } catch (error) {
        console.log(error);
    }
}
