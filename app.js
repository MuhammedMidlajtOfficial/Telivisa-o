const express = require('express');
const app = express();
const path = require('path');
const userRouter = require('./Routes/userRouter');
const adminRouter = require('./Routes/adminRouter');
const {v4 : uuidv4} = require('uuid');
const session = require('express-session');

require('./DB/database')

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret: uuidv4(),
    resave : false,
    saveUninitialized : true
}))

const port = process.env.PORT || 3000

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views/'));
//load static files
app.use(express.static(path.join(__dirname , 'Public')) )


app.use('/user',userRouter)
app.use('/admin',adminRouter)

app.listen(port ,'127.0.0.1',()=>{
    console.log('Server connected\nhttp://127.0.0.1:3000/user\nhttp://127.0.0.1:3000/admin');
})