const categorySchema = require('../../Model/categorySchema')

const getAdminAddCategories = async (req,res)=>{
    try {
        const category = await categorySchema.find({})
        res.render('Admin/adminCategories' , { category });
    } catch (error) {
        console.log(error);
    }
}

const postAdminAddCategories = async (req,res)=>{
    try {
        const category = await categorySchema.find({})
        let existCateg;
        category.forEach(categ => {
            if(categ.categoryName.toLowerCase() === req.body.categoryName.toLowerCase()){
                existCateg = true;
            }
        });
        if(existCateg){
            res.render('Admin/adminCategories' , { category , categoryExist : true });
        } else {
            const newCategory = await new categorySchema({
                categoryName : req.body.categoryName,
                status : req.body.categoryStatus
            })
            newCategory.save();
            const category = await categorySchema.find({})
            res.render('Admin/adminCategories' , { category });
        }
    } catch (error) {
        console.log(error);
    }
}

const getAdminEditCategories = async (req,res)=>{
    try {
        const id = req.query.id;
        
        const category = await categorySchema.find({})
        const selectedCategory = await categorySchema.findOne({ _id : id })
        res.render('Admin/adminCategories' , { category , editCategory:true ,  selectedCategory });
    } catch (error) {
        console.log(error);
    }
}

const postAdminEditCategories = async (req,res)=>{
    try{
        const id = req.query.id;
    
        await categorySchema.updateOne({ _id : id },{$set:{
            categoryName : req.body.categoryName,
            status : req.body.categoryStatus
        }})
        res.redirect('/admin/getAdminCategories');
    }catch (error) {
        console.log(error);
    }
}

const getAdminBlockCategories = async (req,res)=>{
    try{
        const id = req.query.id;
        await categorySchema.updateOne({ _id : id },{$set:{ status : 'Inactive' }})
        const category = await categorySchema.find({})
        
        res.render('Admin/adminCategories' , { category  })
    }catch (error) {
        console.log(error);
    }
}

const getAdminUnblockCategories = async (req,res)=>{
    try{  
        const id = req.query.id;
        await categorySchema.updateOne({ _id : id },{$set:{ status : 'Active' }})
        
        const category = await categorySchema.find({})
        res.render('Admin/adminCategories' , { category })
    }catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAdminAddCategories,
    postAdminAddCategories,
    getAdminEditCategories,
    postAdminEditCategories,
    getAdminBlockCategories,
    getAdminUnblockCategories,

}

