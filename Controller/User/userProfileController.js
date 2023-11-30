const userSchema = require('../../Model/userSchema')
const addressSchema = require('../../Model/addressSchema');
const ProductSchema = require('../../Model/ProductSchema');
const orderSchema = require('../../Model/orderSchema')
const walletSchema = require('../../Model/walletSchema')

module.exports.getUserProfile = async (req,res,next)=>{
    try {
        const email = req.session.user;
        const user = await userSchema.findOne({ email })
        const userId = user._id
        const addressObj = await addressSchema.findOne({ userId })
        const orders = await orderSchema.find({ userId }).sort({ createdAt:-1 })
        const wallet = await walletSchema.findOne({ userId })
        res.render('User/user-profile',{ user, addressObj, orders, wallet, changeLoginToProfile:true })
    } catch (error) {
        console.log(error);
        next('There is an error occured, Cant\'t get user profile')
    }
}

module.exports.getAddAddress = (req,res)=>{
    const fromCheckout = req.query.fromCheckout;
    if(fromCheckout){
        res.render('User/user-addAddress',{ fromCheckout, changeLoginToProfile:true })
    }else{
        res.render('User/user-addAddress', {changeLoginToProfile:true})
    }
}

module.exports.postAddAddress = async (req,res,next)=>{
    try {
        const email = req.session.user;
        const user = await userSchema.findOne({ email })
        const addressObj = await addressSchema.findOne({ userId : user._id })
        
        const name = req.body.addName
        const phnNumber = req.body.addPhnNumber
        const alterPhnNumber = req.body.addAlterPhnNumber
        const street = req.body.addStreet
        const city = req.body.addCity
        const state = req.body.addState
        const pinCode = req.body.addPinCode

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

        const fromCheckout = req.body.fromCheckout;
        if(fromCheckout){
            res.redirect('/userCheckout')
        }else{
            res.redirect('/userProfile')
        }
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
        res.render('User/user-addAddress', { addressId, existAddress, editAddress:true, changeLoginToProfile:true })
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

