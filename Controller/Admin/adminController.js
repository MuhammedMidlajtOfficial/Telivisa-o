const adminLoginSchema = require('../../Model/adminLoginSchema')

module.exports.getAdminLogin = (req,res)=>{
    res.render('Admin/adminLogin')
}

module.exports.postAdminLogin = async (req,res)=>{
    const admin = await adminLoginSchema.findOne({email : req.body.ALEmail })
    if(admin){
        if(admin.password === req.body.ALPassword){
            req.session.admin = req.body.ALEmail;
            res.redirect('/admin/adminDashboard')
            console.log('Admin logged in');
        }else{
            res.render('Admin/adminLogin',{ emailDoesNotExist : true })
        }
    }else{
        res.render('Admin/adminLogin',{ emailDoesNotExist : true })
    }
}

module.exports.getadminLogout = (req,res)=>{
    req.session.destroy((err)=>{
        if (err) {
            console.log(err);
        } else {
            console.log('Admin log out successfull');
            res.render('Admin/adminLogin',{ adminLogout : true })
        }
    })
}

module.exports.getAdminDashboard = (req,res)=>{
    res.render('Admin/adminDashboard')
}

