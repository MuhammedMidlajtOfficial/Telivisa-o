const ProductSchema = require('../../Model/ProductSchema')
const categorySchema = require('../../Model/categorySchema')

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
        imageArr.forEach(element => {
            imageUrlArray.push(element);
        });
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
            productStatus : req.body.productStatus
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
        let imageArray = await ProductSchema.findOne({ _id : id })
        imageArray = imageArray.imageUrl

        if(req.files.length){
            req.files.forEach((elem)=>{
                imageArray.push(elem)
            })
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
                productStatus : req.body.productStatus
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
                productStatus : req.body.productStatus
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
    imagePath = req.query.image;
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

module.exports.getProductList= (req,res)=>{
    res.render('Admin/adminProductsList');
}