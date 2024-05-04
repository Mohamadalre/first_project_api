 const dotenv = require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/restful-auth-apis')
.then(() => console.log("connected to mongodb"))
.catch((error)=> console.log("not connected to mongodb"));


const express = require('express');
const app = express();

const port = process.env.SERVER_PORT | 3000 ;
const userRoute = require('./routes/userRoute');
const shopperRoute = require('./routes/shopperRoute');
const userprofile = require('./routes/userprofile');
const adminRouter = require('./routes/adminRoute');

app.use('/api', userRoute );
app.use('/api/shopper', shopperRoute );
app.use('/api', userprofile );
app.use('/api/admin', adminRouter );

app.listen(port,  function(){
    console.log('server listen on port '+port);
});