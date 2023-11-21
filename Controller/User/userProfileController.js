const userSchema = require('../../Model/userSchema')
const addressSchema = require('../../Model/addressSchema');
const ProductSchema = require('../../Model/ProductSchema');


module.exports.getUserProfile = async (req,res,next)=>{
    try {
        const email = req.session.user;
        const user = await userSchema.findOne({ email })
        const addressObj = await addressSchema.findOne({ userId : user._id })
        res.render('User/user-profile',{ user, addressObj, changeLoginToProfile:true })
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t get user profile')
    }
}

module.exports.getAddAddress = (req,res)=>{
    res.render('User/user-addAddress')
}

module.exports.postAddAddress = async (req,res,next)=>{
    try {
        const email = req.session.user;
        const user = await userSchema.findOne({ email })
        const addressObj = await addressSchema.findOne({ userId : user._id })
        const {
            name,  
            phnNumber, 
            alterPhnNumber,
            street,
            city,
            state,
            pinCode
         } = req.body
         console.log(user._id);
        if(String(user._id) == String(addressObj?.userId)){
            await addressSchema.updateOne(
                { userId : user._id },
                { $push:
                    { address :{ 
                        name,   
                        email: req.session.user,
                        phnNumber,
                        alterPhnNumber,
                        street,
                        city,
                        state,
                        pinCode,
                     } }
                }
            )
        }else{
            
            const address = new addressSchema({
                userId: user._id,
                address: [{
                    name,
                    email: req.session.user,
                    phnNumber,
                    alterPhnNumber,
                    street,
                    city,
                    state,
                    pinCode,
                }],
            })
            address.save()
        }
        
        res.redirect('/userProfile')
    } catch (error) {
        console.log(error);
        next('There is an error occured, Can\'t add address')
    }
}

module.exports.getDeleteAddress = async (req,res,next)=>{
    try {
        const addressId = req.query.id;
        const email = req.session.user;

        const user = await userSchema.findOne({ email })
        await addressSchema.updateOne({ userId : user._id },{ $pull:{ address:{ _id : addressId } }}) 
        res.redirect('/userProfile')
    } catch (error) {
        console.log(error);
        next('There is an error occured, Can\'t delete address')
    }
}

module.exports.getEditAddress = async (req,res,next)=>{
    try {
        const addressId = req.query.id;
        const email = req.session.user;
        const user = await userSchema.findOne({ email })
        
        const addressObj = await addressSchema.findOne({ userId : user._id })
        let existAddress;
        addressObj.address.forEach(addr =>{
            if(String(addr._id) === String(addressId)){
                existAddress = addr
            }
        })
        res.render('User/user-addAddress', { addressId, existAddress, editAddress:true })
    } catch (error) {
        console.log(error);
        next('There is an error occured, Can\'t edit address')
    }
    
}

module.exports.postEditAddress = async (req,res,next)=>{
    try {
        const addressId = req.body.addressId;
        const email = req.session.user;

        const {
            name,  
            phnNumber, 
            alterPhnNumber,
            street,
            city,
            state,
            pinCode
        } = req.body

        const user = await userSchema.findOne({ email })
        const addressObj = await addressSchema.findOne({ userId : user._id })
        let existAddress;
        addressObj.address.forEach(addr =>{
            if(String(addr._id) === String(addressId)){
                existAddress = addr
            }
        })

        if (existAddress) {
            existAddress.name = name;
            existAddress.phnNumber = phnNumber;
            existAddress.alterPhnNumber = alterPhnNumber;
            existAddress.street = street;
            existAddress.city = city;
            existAddress.state = state;
            existAddress.pinCode = pinCode;
        
            // Save the modified document
            await addressObj.save();
            res.redirect('/userProfile')
        }
    } catch (error) {
        console.log(error);
        next('There is an error occured, Can\'t edit address')
    }
}

module.exports.postUserChangeDetails = async (req,res,next)=>{
    try {
        const email = req.body.email;
        const {
            name,
            phnNumber,
            password,
        } = req.body
    
        await userSchema.updateOne({ email },{ 
            name : name,
            phnNumber : phnNumber,
            password : password
         })
        res.redirect('/userProfile')
    } catch (error) {
        console.log(error);
        next('There is an error occured, Can\'t change user details')
    }
}