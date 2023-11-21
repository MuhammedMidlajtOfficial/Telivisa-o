const userSchema = require('../Model/userSchema');

module.exports.isAdmin = (req,res,next)=>{
    if(req.session.admin){
        next()
    }else{
        res.redirect('/admin')
    }
}

module.exports.isUser = (req,res,next)=>{
    if(!req.session.user){
        res.redirect('/userLogin')
    }else{
        next()
    }
}

module.exports.isUserBlocked = async (req,res,next)=>{
    const userExist = await userSchema.findOne({ email : req.session.user})
    if(userExist){
        if (userExist.status === 'Inactive') {
            res.redirect('/userLogout')
        }else{
            next()
        }
    }else{
        next()
    }
}