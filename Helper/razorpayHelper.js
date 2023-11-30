const Razorpay = require('razorpay');

var instance = new Razorpay({ 
    key_id: process.env.RAZORPAY_KEY_ID , 
    key_secret: process.env.RAZORPAY_KEY_SECRET 
})

module.exports.generateRazorpay = function(orderId, totalAmount){
    return new Promise((resolve,reject)=>{
        
        var options = {
            amount: totalAmount,  // amount in the smallest currency unit
            currency: "INR",
            receipt: orderId
        };

        instance.orders.create(options, function(err, order) {
            if (err) {
                console.log(err);
            } else {
                // console.log('razorpay instance--',order);
                resolve(order)
            }
        });
    })
}
