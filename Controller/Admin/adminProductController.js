const ProductSchema = require('../../Model/ProductSchema')
const categorySchema = require('../../Model/categorySchema')
const fs = require('fs')
const sharp = require('sharp')

module.exports.getAdminProducts = async (req,res)=>{
    try{
        const product = await ProductSchema.find({})
        res.render('Admin/adminProducts',{ product })
    }catch (error) {
        console.log(error);
    }
}

module.exports.getAdminAddProduct = async (req,res)=>{
    try{
        const category = await categorySchema.find({});
        
        res.render('Admin/adminAddProduct',{ category })
    }catch (error) {
        console.log(error);
    }
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
    try{
        const id = req.query.id;
        const product = await ProductSchema.findOne({ _id : id})
        const category = await categorySchema.find({});
        res.render('Admin/adminEditProduct', { product , category} )
    }catch (error) {
        console.log(error);
    }
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
    try {
        const id = req.query.id;
        const imagePath = req.query.image;
        const existProduct = await ProductSchema.findOne({ _id : id})

        if(existProduct.imageUrl.length > 1){
            await ProductSchema.updateOne({ _id : id },{$pull:{ imageUrl:{path : imagePath }}})

            fs.unlinkSync(imagePath);
            console.log('image successfully deleted from Public/uploads' );
        }
        const product = await ProductSchema.findOne({ _id : id})
        const category = await categorySchema.find({})
        res.render('Admin/adminEditProduct', { product, category } )
    } catch (error) {
        console.log(error);
    }
}

module.exports.getAdminBlockProduct = async (req,res)=>{
    try{
        const id = req.query.id;
        console.log(await ProductSchema.updateOne({ _id : id },{$set:{ productStatus : "block" }}));
        res.redirect('/admin/products');
    }catch (error) {
        console.log(error);
    }
}

module.exports.getAdminUnblockProduct = async (req,res)=>{
    try{
        const id = req.query.id;
        await ProductSchema.updateOne({ _id : id },{$set:{ productStatus : "unblock" }});
        res.redirect('/admin/products');
    }catch (error) {
        console.log(error);
    }
}

module.exports.getProductList= async (req,res)=>{
    try{
        const product = await ProductSchema.find({})
        res.render('Admin/adminProductsList',{ product })
    }catch (error) {
        console.log(error);
    }
}

module.exports.getAdminActiveHoarding = async (req,res)=>{
    try{
        const id = req.query.id;
        await ProductSchema.updateOne({ _id : id },{ productHoarding : "Active" })
        res.redirect('/admin/productList');
    }catch (error) {
        console.log(error);
    }
}

module.exports.getAdminInactiveHoarding = async (req,res)=>{
    try{
        const id = req.query.id;
        await ProductSchema.updateOne({ _id : id },{ productHoarding : "Inactive" })
        res.redirect('/admin/productList');
    }catch (error) {
        console.log(error);
    }
}