const offerSchema = require('../../Model/offerSchema')

module.exports.getBrandOffer = async (req,res)=>{
    const offers = await offerSchema.find({ })
    res.render('Admin/adminOffers',{ offers })
}

module.exports.postAdminAddBrandOffer = async (req,res)=>{
    const bodyValue = req.body
    const OfferName = bodyValue.OfferName
    const OfferType = bodyValue.OfferType
    const amount = bodyValue.Amount
    const minPrice = bodyValue.minPrice
    const maxPrice = bodyValue.maxPrice
    const expiryDate = bodyValue.expiryDate
    const status = bodyValue.status

    let offers;
    if (maxPrice) {
        offers = await new offerSchema({
            OfferName,
            OfferType,
            amount,
            minPrice,
            maxPrice,
            expiryDate,
            status,
        })
    }else{
        offers = await new offerSchema({
            OfferName,
            OfferType,
            amount,
            minPrice,
            maxPrice,
            expiryDate,
            status,
        })
    }

    offers.save()
    res.redirect('/admin/adminOffers')
}

module.exports.notAdminChangeOfferStatus = async (req,res)=>{
    const _id = req.query.id
    const status = req.query.status
    await offerSchema.updateOne({ _id },{ $set:{ status } })
    res.redirect('/admin/adminOffers')
}

module.exports.getAdminEditOffer = async (req,res)=>{
    try {
        const _id = req.query.id
        const selectedOffers = await offerSchema.findOne({ _id })
        const offers = await offerSchema.find({ })
        res.render('Admin/adminOffers',{ offers, selectedOffers, editOffer:true })
    } catch (error) {
        console.log(error);
    }
}

module.exports.postAdminEditOffer = async (req,res)=>{
    const _id = req.query.id
    const bodyValue = req.body
    const OfferName = bodyValue.OfferName
    const OfferType = bodyValue.OfferType
    const amount = bodyValue.Amount
    const minPrice = bodyValue.minPrice
    const maxPrice = bodyValue.maxPrice
    const expiryDate = bodyValue.expiryDate
    const status = bodyValue.status

    if (maxPrice) {
        await offerSchema.updateOne({
            OfferName,
            OfferType,
            amount,
            minPrice,
            maxPrice,
            expiryDate,
            status,
        })
    }else{
        await offerSchema.updateOne({
            OfferName,
            OfferType,
            amount,
            minPrice,
            maxPrice,
            expiryDate,
            status,
        })
    }
    res.redirect('/admin/adminOffers')
}

