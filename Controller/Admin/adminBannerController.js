const bannerSchema = require('../../Model/bannerSchema')
const fs = require('fs')
const sharp = require('sharp')


module.exports.getAdminBanner = async (req,res)=>{
    const Banners = await bannerSchema.find({ status:'Active' })
    res.render('Admin/adminBanner',{ Banners })
}

module.exports.postAdminBanner = async (req,res)=>{
    try {
        const imageArr = req.files;
        const mainTitle = req.body.mainTitle;
        const subTitle = req.body.subTitle;
        const offers = req.body.Offers;
        const offerType = req.body.OffersType;
        const expiryDate = req.body.ExpiryDate;
        const status = req.body.BannerStatus;

        // const imageUrlArray = [];
        
        // for (let i = 0; i < imageArr.length; i++) {
        //     const croppedImage = await sharp(imageArr[i].path)
        //       .resize({ width : 1024 , height:700})
        //       .toBuffer();
        
        //     const filename = `cropped_${imageArr[i].filename}`;
        //     const filePath = `Public/uploads/${filename}`;
        //     await sharp(croppedImage).toFile(filePath);
        //     imageUrlArray.push({path:filePath})
        // }
        
        const bannerData = await new bannerSchema({
            mainTitle,
            subTitle,
            offers,
            offerType,
            expiryDate,
            status,
            image : imageArr
        })
        bannerData.save();

        res.redirect('/admin/adminBanner')
        
    } catch (error) {
        console.log(error);
    }
}