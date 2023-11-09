const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/Televisao')
.then(()=>{
    console.log('Database connected');
}).catch(err=>{
    console.log(err);
})