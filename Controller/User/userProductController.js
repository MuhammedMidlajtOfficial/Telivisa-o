const categorySchema = require('../../Model/categorySchema')
const ProductSchema = require('../../Model/ProductSchema')

module.exports.getAllCategory = async (req,res)=>{
    const category = await categorySchema.find({ status : "Active" });
    const products = await ProductSchema.find({ productStatus : "unblock" })
    const newAddedProducts  = await ProductSchema.aggregate([{$match : { productStatus : "unblock" }} ,{$sort:{createdAt:1}},{$limit:3} ])

    res.render('User/user-allCategory',{ category, products, newAddedProducts })
}

module.exports.getViewProduct = async (req,res)=>{
    try {
        const id = req.query.id;
        const productDetails = await ProductSchema.findOne({ _id : id })
        const products = await ProductSchema.find({$and:[{ _id :{$ne : productDetails.id } }, { productStatus : "unblock"} , { productBrand : productDetails.productBrand }]})
        res.render('User/user-viewProduct',{ productDetails, products })
    } catch (error) {
        console.log(error);
    }
    
} 