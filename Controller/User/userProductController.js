const categorySchema = require('../../Model/categorySchema')
const ProductSchema = require('../../Model/ProductSchema')

module.exports.getAllCategory = async (req,res,next)=>{
    try {
        const popularBrand = req.query.brand;
        const sortOrder = req.query.price
        const newAddedProducts  = await ProductSchema.aggregate([{$match : { productStatus : "unblock" }} ,{$sort:{createdAt:1}},{$limit:3} ])

        // Filter
        if(popularBrand){
            const products = await ProductSchema.find({ productStatus : "unblock" , productBrand : popularBrand })
            res.render('User/user-allCategory',{ products, newAddedProducts ,sortOrder,  })
        }else{
            if(sortOrder === "lowToHigh"){
                const products = await ProductSchema.find({ productStatus : "unblock" }).sort({productPrice:1})
                res.render('User/user-allCategory',{ products, newAddedProducts, sortOrder,  })
            }else if(sortOrder === "highToLow"){
                const products = await ProductSchema.find({ productStatus : "unblock" }).sort({productPrice:-1})
                res.render('User/user-allCategory',{ products, newAddedProducts, sortOrder,  })
            }else{
                const products = await ProductSchema.find({ productStatus : "unblock" })
                res.render('User/user-allCategory',{ products, newAddedProducts, sortOrder,  })
            }
        }
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t show all category')
    }
}

module.exports.getViewProduct = async (req,res,next)=>{
    try {
        const id = req.query.id;
        const productDetails = await ProductSchema.findOne({ _id : id })
        const products = await ProductSchema.find({$and:[{ _id :{$ne : productDetails.id } }, { productStatus : "unblock"} , { productBrand : productDetails.productBrand }]})
        res.render('User/user-viewProduct',{ productDetails, products })
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t display product view page')
    }
} 

module.exports.postFillter = async (req,res,next)=>{
    const priceRange = req.body.priceRange.split(' - ')
    const sizeArr = []

    const minPrice = priceRange[0].slice(1)
    const maxPrice = priceRange[1].slice(1)
    const checked = req.body
    let obj = Object.values(checked)
    obj.splice(0,1)
    let size = []
    let resolution = []
    obj.forEach(element => {
        if(element === '55 inches' || element === '65 inches' || element === '75 inches' || element === '85 inches'){
            size.push(element)
        }else if(element == '720p' || element == '1080p' || element == '4K' || element == '8K' ){
            resolution.push(element)
        }
    });
    let product;
    if(size.length > 0 && resolution.length > 0 ){
        products = await ProductSchema.find({ productSize:{ $in : size }, productResolution :{ $in : resolution }, productPrice: { $gte: minPrice, $lte: maxPrice } }) 
    } else if (resolution.length > 0){
        products = await ProductSchema.find({ productResolution :{ $in : resolution }, productPrice: { $gte: minPrice, $lte: maxPrice } }) 
    }else if(size.length > 0){
        products = await ProductSchema.find({ productSize:{ $in : size }, productPrice: { $gte: minPrice, $lte: maxPrice } }) 
    }else{
        products = await ProductSchema.find({ productPrice: { $gte: minPrice, $lte: maxPrice } }) 
    }
    const newAddedProducts  = await ProductSchema.aggregate([{$match : { productStatus : "unblock" }} ,{$sort:{createdAt:1}},{$limit:3} ])
    res.render('User/user-allCategory',{ products, newAddedProducts })
}