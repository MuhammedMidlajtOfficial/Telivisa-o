const userSchema = require('../../Model/userSchema')

module.exports.getAdminUser = async (req,res)=>{
    const user = await userSchema.find({});
    res.render('Admin/adminUser' ,{ user }) 
}

module.exports.getAdminBlockUser = async (req,res)=>{
    const id = req.query.id;
    await userSchema.updateOne({ _id : id }, {$set :{ status : "Inactive" }})
    res.redirect('adminUser')
}

module.exports.getAdminUnblockUser = async (req,res)=>{
    const id = req.query.id;
    await userSchema.updateOne({ _id : id }, {$set :{ status : "Active" }})
    res.redirect('adminUser')
}