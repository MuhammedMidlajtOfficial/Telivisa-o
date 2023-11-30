const userSchema = require('../../Model/userSchema')

module.exports.getAdminUser = async (req,res)=>{
    try{
        const user = await userSchema.find({});
        res.render('Admin/adminUser' ,{ user }) 
    }catch (error) {
        console.log(error);
    }
}

module.exports.getAdminBlockUser = async (req,res)=>{
    try{
        const id = req.query.id;
        await userSchema.updateOne({ _id : id }, {$set :{ status : "Inactive" }})
        res.redirect('adminUser')
    }catch (error) {
        console.log(error);
    }
}

module.exports.getAdminUnblockUser = async (req,res)=>{
    try{
        const id = req.query.id;
        await userSchema.updateOne({ _id : id }, {$set :{ status : "Active" }})
        res.redirect('adminUser')
    }catch (error) {
        console.log(error);
    }
}