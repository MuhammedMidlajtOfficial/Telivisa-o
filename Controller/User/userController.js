const session = require('express-session')
const userSchema = require('../../Model/userSchema')
const ProductSchema = require('../../Model/ProductSchema')

module.exports.getHomePage = async (req,res)=>{
    const featuredProducts = await ProductSchema.find({})
    res.render('User/homePage',{ title : 'Telivisāo' , featuredProducts, changeLoginToProfile : false})
}

module.exports.userLogin = (req,res)=>{
    res.render('User/user-login',{ title : 'Telivisāo | User Login' , changeLoginToProfile : false})
}

module.exports.postUserLogin = async(req,res)=>{
    try {
        const userdata = await userSchema.findOne({email : req.body.ULEmail })
        if( userdata ){
            if(userdata.password === req.body.ULPassword){
                req.session.user = req.body.ULEmail;
                res.render('User/homePage',{ title : 'Telivisāo' , changeLoginToProfile : true, changeLoginToProfile : true})
                console.log(req.session.user,'LoggedIn');
            }else{
                res.render('User/user-login',{ title : 'User Login' , emailDoesNotExist : true , changeLoginToProfile : false})
            }
        }else{
            res.render('User/user-login',{ title : 'User Login' , emailDoesNotExist : true , changeLoginToProfile : false})
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.getUserLogout = (req,res)=>{
    let userSession = req.session.user;
    req.session.destroy((err)=>{
        if(err){
            console.log('Error occured\n',err)
        }else{
            console.log(userSession,'Log out success');
            userSession = null;
            res.render('User/homePage',{ title : 'User Login' , emailDoesNotExist : true , changeLoginToProfile : false})
        }
    })
}

module.exports.getUserSignup = (req,res)=>{
    res.render('User/user-signup',{ title : 'User Signup' , changeLoginToProfile : false})
}

module.exports.postUserSignup = async (req,res)=>{
    try {
       const data = await userSchema.findOne({email : req.body.USEmail}) 
       console.log(data);
       if(data){
            res.render('User/user-signup',{ title : 'User Signup' , emailAlreadyExist:true , changeLoginToProfile : false})
       } else {
            let userData = new userSchema({
                name : req.body.USName,
                email :req.body.USEmail,
                phnNumber : req.body.USPhnNumber,
                password : req.body.USPassword
            })        
            await userData.save();
            res.redirect('/user/userLogin')
       }
    } catch (error) {
        console.log(error);
    }
}