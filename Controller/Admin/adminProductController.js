const ProductSchema = require('../../Model/ProductSchema')
const categorySchema = require('../../Model/categorySchema')
const fs = require('fs')
const sharp = require('sharp')

module.exports.getAdminProducts = async (req,res)=>{
    const product = await ProductSchema.find({})
    res.render('Admin/adminProducts',{ product })
}

module.exports.getAdminAddProduct = async (req,res)=>{
    const category = await categorySchema.find({});
    
    res.render('Admin/adminAddProduct',{ category })
}

module.exports.postAdminAddProduct = async(req,res)=>{
    try {
        const imageArr = req.files;
        let imageUrlArray = [];
        
        for (let i = 0; i < imageArr.length; i++) {
            const croppedImage = await sharp(imageArr[i].path)
              .resize({ width : 1024 , height:700})
              .toBuffer();
      
            const filename = `cropped_${imageArr[i].filename}`;
            const filePath = `Public/uploads/${filename}`;
            await sharp(croppedImage).toFile(filePath);
            imageUrlArray.push({path:filePath})
        }
        
        const productData = await new ProductSchema({
            productName : req.body.productName,
            productBrand : req.body.productBrand,
            productSize : req.body.productSize,
            productResolution : req.body.productResolution,
            productStock : req.body.productStock,
            productCategory : req.body.productCategory,
            productDescription : req.body.productDescription,
            productPrice : req.body.productPrice,
            productPromoPrice : req.body.productPromoPrice,
            imageUrl : imageUrlArray,
            productStatus : req.body.productStatus,
            productHoarding : "Inactive"
        })
    
        productData.save();
        res.redirect('/admin/adminAddProduct')    
    } catch (error) {
        console.log(error);
    }
}

module.exports.getAdminEditProduct = async (req,res)=>{
    const id = req.query.id;
    const product = await ProductSchema.findOne({ _id : id})
    const category = await categorySchema.find({});
    res.render('Admin/adminEditProduct', { product , category} )
}

module.exports.postAdminEditProduct = async (req,res)=>{
    try {
        const id = req.query.id;
        const imageArr = req.files;
        let imageArray = await ProductSchema.findOne({ _id : id })
        imageArray = imageArray.imageUrl
        
        if(imageArr.length){
            for (let i = 0; i < imageArr.length; i++) {
                const croppedImage = await sharp(imageArr[i].path)
                  .resize({ width : 1024 , height:700})
                  .toBuffer();
          
                const filename = `cropped_${imageArr[i].filename}`;
                const filePath = `Public/uploads/${filename}`;
                await sharp(croppedImage).toFile(filePath);
                imageArray.push({path:filePath})
            }
        }

        let productData;
        if(req.files !== undefined || req.files.length > 0){
            productData = {
                productName : req.body.productName,
                productBrand : req.body.productBrand,
                productSize : req.body.productSize,
                productResolution : req.body.productResolution,
                productStock : req.body.productStock,
                productCategory : req.body.productCategory,
                productDescription : req.body.productDescription,
                productPrice : req.body.productPrice,
                productPromoPrice : req.body.productPromoPrice,
                imageUrl : imageArray,
                productStatus : req.body.productStatus,
                productHoarding : "Inactive"
            }
        }else{
            productData = {
                productName : req.body.productName,
                productBrand : req.body.productBrand,
                productSize : req.body.productSize,
                productResolution : req.body.productResolution,
                productStock : req.body.productStock,
                productCategory : req.body.productCategory,
                productDescription : req.body.productDescription,
                productPrice : req.body.productPrice,
                productPromoPrice : req.body.productPromoPrice,
                productStatus : req.body.productStatus,
                productHoarding : "Inactive"
            }
        }
        await ProductSchema.updateOne({ _id : id} , productData)

        res.redirect('/admin/products')
    } catch (error) {
        console.log(error)
    }
}

module.exports.getAdminDeleteProductImage = async (req,res)=>{
    const id = req.query.id;
    const imagePath = req.query.image;
    await ProductSchema.updateOne({ _id : id },{$pull:{ imageUrl:{path : imagePath }}})
    const product = await ProductSchema.findOne({ _id : id})
    const category = await categorySchema.find({})
    res.render('Admin/adminEditProduct', { product, category } )
}

module.exports.getAdminBlockProduct = async (req,res)=>{
    const id = req.query.id;
    console.log(await ProductSchema.updateOne({ _id : id },{$set:{ productStatus : "block" }}));
    res.redirect('/admin/products');
}

module.exports.getAdminUnblockProduct = async (req,res)=>{
    const id = req.query.id;
    await ProductSchema.updateOne({ _id : id },{$set:{ productStatus : "unblock" }});
    res.redirect('/admin/products');
}

module.exports.getProductList= async (req,res)=>{
    const product = await ProductSchema.find({})
    res.render('Admin/adminProductsList',{ product })
}

module.exports.getAdminActiveHoarding = async (req,res)=>{
    const id = req.query.id;
    await ProductSchema.updateOne({ _id : id },{ productHoarding : "Active" })
    res.redirect('/admin/productList');
}

module.exports.getAdminInactiveHoarding = async (req,res)=>{
    const id = req.query.id;
    await ProductSchema.updateOne({ _id : id },{ productHoarding : "Inactive" })
    res.redirect('/admin/productList');
}