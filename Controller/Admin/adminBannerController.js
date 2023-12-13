const { log } = require('console');
const bannerSchema = require('../../Model/bannerSchema')
const fs = require('fs')
const sharp = require('sharp')


module.exports.getAdminBanner = async (req,res)=>{
    const timestamp = Date.now();
    const date = new Date(timestamp).toISOString().split('T')[0];
    const Banners = await bannerSchema.find({ })
    console.log(date);
    res.render('Admin/adminBanner',{ Banners, date })
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

module.exports.getAdminEditBanner = async(req,res)=>{
    const _id = req.query.id;
    const selectedBanner = await bannerSchema.findOne({ _id })
    const Banners = await bannerSchema.find({ })

    res.render('Admin/adminBanner',{ selectedBanner, Banners, EditBanner:true})
}

module.exports.postAdminEditBanner = async (req,res) =>{
    try {
        const _id = req.query.id
        const imageArr = req.files;
        const mainTitle = req.body.mainTitle;
        const subTitle = req.body.subTitle;
        const offers = req.body.Offers;
        const offerType = req.body.OffersType;
        const expiryDate = req.body.ExpiryDate;
        const status = req.body.BannerStatus;

        if(imageArr.length){
            await bannerSchema.updateOne({ _id },{ 
                mainTitle,
                subTitle,
                offers,
                offerType,
                expiryDate,
                status,
                image : imageArr
            })
        }else{
            await bannerSchema.updateOne({ _id },{ 
                mainTitle,
                subTitle,
                offers,
                offerType,
                expiryDate,
                status,
            })
        }

        res.redirect('/admin/adminBanner')

    } catch (error) {
        console.log(error);
    }
}

module.exports.getAdminChangeBannerStatus = async (req,res)=>{
    const id = req.query.id;
    const status = req.query.status;

    await bannerSchema.updateOne({ _id : id },{ $set:{ status }})
    res.redirect('/admin/adminBanner')
}