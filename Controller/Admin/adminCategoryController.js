const categorySchema = require('../../Model/categorySchema')

const getAdminAddCategories = async (req,res)=>{
    const category = await categorySchema.find({})
    res.render('Admin/adminCategories' , { category });
}

const postAdminAddCategories = async (req,res)=>{
    const newCategory = await new categorySchema({
        categoryName : req.body.categoryName,
        status : req.body.categoryStatus
    })
    newCategory.save();

    const category = await categorySchema.find({})
    res.render('Admin/adminCategories' , { category });
}

const getAdminEditCategories = async (req,res)=>{
    const id = req.query.id;
    
    const category = await categorySchema.find({})
    const selectedCategory = await categorySchema.findOne({ _id : id })
    res.render('Admin/adminCategories' , { category , editCategory:true ,  selectedCategory });
}

const postAdminEditCategories = async (req,res)=>{
    const id = req.query.id;

    await categorySchema.updateOne({ _id : id },{$set:{
        categoryName : req.body.categoryName,
        status : req.body.categoryStatus
    }})
    res.redirect('/admin/getAdminCategories');
}

const getAdminBlockCategories = async (req,res)=>{
    const id = req.query.id;
    
    await categorySchema.updateOne({ _id : id },{$set:{ status : 'Inactive' }})

    const category = await categorySchema.find({})
    const selectedCategory = await categorySchema.findOne({ _id : id })
    res.render('Admin/adminCategories' , { category ,  selectedCategory })
}

const getAdminUnblockCategories = async (req,res)=>{
    const id = req.query.id;
    
    await categorySchema.updateOne({ _id : id },{$set:{ status : 'Active' }})
    
    const category = await categorySchema.find({})
    const selectedCategory = await categorySchema.findOne({ _id : id })
    res.render('Admin/adminCategories' , { category ,  selectedCategory })
}

module.exports = {
    getAdminAddCategories,
    postAdminAddCategories,
    getAdminEditCategories,
    postAdminEditCategories,
    getAdminBlockCategories,
    getAdminUnblockCategories,

}

