const categorySchema = require('../../Model/categorySchema')
const ProductSchema = require('../../Model/ProductSchema')
const userSchema = require('../../Model/userSchema')

module.exports.getAllCategory = async (req,res,next)=>{
    try {
        const user = await userSchema.findOne({ email : req.session.user })
        const popularBrand = req.query.brand;
        const sortOrder = req.query.price
        const newAddedProducts  = await ProductSchema.aggregate([{$match : { productStatus : "unblock" }} ,{$sort:{createdAt:1}},{$limit:3} ])
        
        const page = req.query.page ?? 1;
        const no_of_docs_each_page = 6;
        

        if(user){
            // Filter
            if(popularBrand){
                const popproducts = await ProductSchema.find({ productStatus : "unblock" , productBrand : popularBrand })
                const totalPages = Math.ceil(popproducts.length / no_of_docs_each_page);
                const skip = (page - 1) * no_of_docs_each_page;
                const products = await ProductSchema.find({ productStatus : "unblock" , productBrand : popularBrand }).sort({productPrice:1}).skip(skip).limit(no_of_docs_each_page)
                res.render('User/user-allCategory',{ products, newAddedProducts ,sortOrder, popularBrand, changeLoginToProfile : true, totalPages, page })
            }else{
                const popproducts = await ProductSchema.find({ productStatus : "unblock" })
                const totalPages = Math.ceil(popproducts.length / no_of_docs_each_page);
                const skip = (page - 1) * no_of_docs_each_page;
                const products = await ProductSchema.find({ productStatus : "unblock" }).sort({productPrice:1}).skip(skip).limit(no_of_docs_each_page)
                res.render('User/user-allCategory',{ products, newAddedProducts, sortOrder, changeLoginToProfile : true, totalPages, page })
            }
        }else{
            // Filter
            if(popularBrand){
                const popproducts = await ProductSchema.find({ productStatus : "unblock" , productBrand : popularBrand })
                const totalPages = Math.ceil(popproducts.length / no_of_docs_each_page);
                const skip = (page - 1) * no_of_docs_each_page;
                const products = await ProductSchema.find({ productStatus : "unblock" , productBrand : popularBrand }).sort({productPrice:1}).skip(skip).limit(no_of_docs_each_page)
                res.render('User/user-allCategory',{ products, newAddedProducts , sortOrder, popularBrand, totalPages, page })
            }else{
                const popproducts = await ProductSchema.find({ productStatus : "unblock" }).sort({productPrice:1})
                const totalPages = Math.ceil(popproducts.length / no_of_docs_each_page);
                const skip = (page - 1) * no_of_docs_each_page;
                const products = await ProductSchema.find({ productStatus : "unblock" }).sort({productPrice:1}).skip(skip).limit(no_of_docs_each_page)
                res.render('User/user-allCategory',{ products, newAddedProducts, sortOrder, totalPages, page })
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
        const user = await userSchema.findOne({ email : req.session.user })
        const productDetails = await ProductSchema.findOne({ _id : id })
        const products = await ProductSchema.find({$and:[{ _id :{$ne : productDetails.id } }, { productStatus : "unblock"} , { productBrand : productDetails.productBrand }]})
        if(user){
            res.render('User/user-viewProduct',{ productDetails, products, changeLoginToProfile : true })
        }else{
            res.render('User/user-viewProduct',{ productDetails, products })
        }
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t display product view page')
    }
} 

module.exports.postFillter = async (req,res,next)=>{
    try {
        const priceRange = req.body.priceRange.split(' - ')
        const popularBrand = req.body.brand;
    
        const page = req.query.page ?? 1;
        const no_of_docs_each_page = 6;
    
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
        let products;
        let totalPages
        if (popularBrand) {
            if(size.length > 0 && resolution.length > 0 ){
                const popproducts = await ProductSchema.find({ productSize:{ $in : size }, productResolution :{ $in : resolution }, productPrice: { $gte: minPrice, $lte: maxPrice } ,productBrand : popularBrand})
                totalPages = Math.ceil(popproducts.length / no_of_docs_each_page);
                const skip = (page - 1) * no_of_docs_each_page;
                products = await ProductSchema.find({ productSize:{ $in : size }, productResolution :{ $in : resolution }, productPrice: { $gte: minPrice, $lte: maxPrice } ,productBrand : popularBrand}).sort({ productPrice:1 }).skip(skip).limit(no_of_docs_each_page)
            } else if (resolution.length > 0){
                const popproducts = await ProductSchema.find({ productResolution :{ $in : resolution }, productPrice: { $gte: minPrice, $lte: maxPrice } ,productBrand : popularBrand})
                totalPages = Math.ceil(popproducts.length / no_of_docs_each_page);
                const skip = (page - 1) * no_of_docs_each_page;
                products = await ProductSchema.find({ productResolution :{ $in : resolution }, productPrice: { $gte: minPrice, $lte: maxPrice } ,productBrand : popularBrand}).sort({ productPrice:1 }).skip(skip).limit(no_of_docs_each_page)
            }else if(size.length > 0){
                const popproducts = await ProductSchema.find({ productSize:{ $in : size }, productPrice: { $gte: minPrice, $lte: maxPrice } ,productBrand : popularBrand})
                totalPages = Math.ceil(popproducts.length / no_of_docs_each_page);
                const skip = (page - 1) * no_of_docs_each_page;
                products = await ProductSchema.find({ productSize:{ $in : size }, productPrice: { $gte: minPrice, $lte: maxPrice } ,productBrand : popularBrand}).sort({ productPrice:1 }).skip(skip).limit(no_of_docs_each_page)
            }else{
                const popproducts = await ProductSchema.find({ productPrice: { $gte: minPrice, $lte: maxPrice } , productBrand : popularBrand})
                totalPages = Math.ceil(popproducts.length / no_of_docs_each_page);
                const skip = (page - 1) * no_of_docs_each_page;
                products = await ProductSchema.find({ productPrice: { $gte: minPrice, $lte: maxPrice } , productBrand : popularBrand}).sort({ productPrice:1 }).skip(skip).limit(no_of_docs_each_page)
            }
        }else{
            if(size.length > 0 && resolution.length > 0 ){
                const popproducts = await ProductSchema.find({ productSize:{ $in : size }, productResolution :{ $in : resolution }, productPrice: { $gte: minPrice, $lte: maxPrice } })
                totalPages = Math.ceil(popproducts.length / no_of_docs_each_page);
                const skip = (page - 1) * no_of_docs_each_page;
                products = await ProductSchema.find({ productSize:{ $in : size }, productResolution :{ $in : resolution }, productPrice: { $gte: minPrice, $lte: maxPrice } }).sort({ productPrice:1 }).skip(skip).limit(no_of_docs_each_page)
            } else if (resolution.length > 0){
                const popproducts = await ProductSchema.find({ productResolution :{ $in : resolution }, productPrice: { $gte: minPrice, $lte: maxPrice } })
                totalPages = Math.ceil(popproducts.length / no_of_docs_each_page);
                const skip = (page - 1) * no_of_docs_each_page;
                products = await ProductSchema.find({ productResolution :{ $in : resolution }, productPrice: { $gte: minPrice, $lte: maxPrice } }).sort({ productPrice:1 }).skip(skip).limit(no_of_docs_each_page)
            }else if(size.length > 0){
                const popproducts = await ProductSchema.find({ productSize:{ $in : size }, productPrice: { $gte: minPrice, $lte: maxPrice } })
                totalPages = Math.ceil(popproducts.length / no_of_docs_each_page);
                const skip = (page - 1) * no_of_docs_each_page;
                products = await ProductSchema.find({ productSize:{ $in : size }, productPrice: { $gte: minPrice, $lte: maxPrice } }).sort({ productPrice:1 }).skip(skip).limit(no_of_docs_each_page)
            }else{
                const popproducts = await ProductSchema.find({ productPrice: { $gte: minPrice, $lte: maxPrice } })
                totalPages = Math.ceil(popproducts.length / no_of_docs_each_page);
                const skip = (page - 1) * no_of_docs_each_page;
                products = await ProductSchema.find({ productPrice: { $gte: minPrice, $lte: maxPrice } }).sort({ productPrice:1 }).skip(skip).limit(no_of_docs_each_page)
            }
        }
    
        // Sort By Price
        if(checked.sort === "highToLow"){
            products.sort((a, b) => b.productPrice - a.productPrice);
        }
        
        const newAddedProducts  = await ProductSchema.aggregate([{$match : { productStatus : "unblock" }} ,{$sort:{createdAt:1}},{$limit:3} ])
    
        res.render('User/user-allCategory',{ products, newAddedProducts, totalPages, page })
        
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t filter product')
    }
}

module.exports.postAllCategorySearch = async (req,res,next)=>{
    try {
        const user = await userSchema.findOne({ email : req.session.user })
        const search = "^" + req.body.search;
        const searchReg = new RegExp(search, 'i');
        const page = req.query.page ?? 1;
        const no_of_docs_each_page = 6;
        const newAddedProducts  = await ProductSchema.aggregate([{$match : { productStatus : "unblock" }} ,{$sort:{createdAt:1}},{$limit:3} ])
        const popproducts = await ProductSchema.find({ productStatus : "unblock", productName :{ $regex : search, $options : 'i'  } }).sort({productPrice:1})
        const totalPages = Math.ceil(popproducts.length / no_of_docs_each_page);
        const skip = (page - 1) * no_of_docs_each_page;

        if (user) {
            const products = await ProductSchema.find({ productStatus : "unblock", productName :{ $regex : searchReg, $options : 'i'  } }).sort({productPrice:1}).skip(skip).limit(no_of_docs_each_page)
            res.render('User/user-allCategory',{ products, newAddedProducts, totalPages, page, changeLoginToProfile : true })
        }else{
            console.log(typeof(searchReg));
            const products = await ProductSchema.find({ productStatus : "unblock", productName :{ $regex : searchReg } }).sort({productPrice:1}).skip(skip).limit(no_of_docs_each_page)
            res.render('User/user-allCategory',{ products, newAddedProducts, totalPages, page })
        }
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t search')
    }
}
