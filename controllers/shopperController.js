const Shopper= require('../models/shopperModels');
const bcrypt = require('bcrypt');
const bcrypts = require('bcryptjs');
const {validationResult} = require('express-validator');
const createToken = require('../utile/createToken');
const asyncHandler = require('express-async-handler');
 const mailer = require('../helpers/mailer');
// const ApiError = require('../utile/ApiError');
 const jwt = require('jsonwebtoken');
const factory = require('./handlersFactory');
const crypto = require('crypto');
const { log } = require('console');
const Blacklist = require('../models/blacklistModels');




 const registershopper = async(req,res) => {

    try{

      const errors =  validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
            success:false,
            msg:  'Errors',
            errors: errors.array()
        
        });
      }
        const {name, email, mobile, password} = req.body;


const isExists = await Shopper.findOne({email});

if(isExists){
    return res.status(400).json({
        success:false,
        msg:  'email Already Exists!'
    
    });
}
       const hashPassword = await  bcrypt.hash(password,10);
  
       const shopper =  new Shopper (
            {
                name,
                email,
                mobile,
                password:hashPassword,
            }
         );
          

           const shopperData = await shopper.save();
           const token =jwt.sign({id:shopperData._id,is_shopper : shopperData.is_shopper},process.env.JWT_SECRET_KEY,{ expiresIn: '2h' });
           return res.status(200).json({
            success:true,
            msg: 'Registered successfuly!',
            shopper:shopperData,
            accessToken:token,
            tokenType: 'Bearer'
  
        });
        
    }catch(error){
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
//////////////infoshopper
const infoshopper = async(req,res) => {

  try{

    const errors =  validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
          success:false,
          msg:  'Errors',
          errors: errors.array()
      
      });
    }
    
    const  id  = req.shopper.id;
    const{ event_name,location}= req.body;
    const data= {
      event_name,
      location

    }

  // 1) Build query
  if(req.file !==undefined){
    data.image = 'image/'+req.file.filename;
  }
  const shopper_info =await Shopper.findByIdAndUpdate(req.shopper.id,{
    $set:data
  },{new:true});
    if(!shopper_info){res.status(404).json({success:false, message: 'you do not shopper'});}
    
    

         return res.status(200).json({
          success:true,
          msg: 'info successfuly!',
          name_shopper:shopper_info.event_name,
          loction:shopper_info.location,
          image:shopper_info.image,
          name:shopper_info.name,
          mobile:shopper_info.mobile,

      });
      
  }catch(error){
      return res.status(400).json({
          success:false,
          msg:error.message
      });
  }
}


  

const loginshopper = async(req, res) => {
    try{

const errors = validationResult(req);
if (!errors.isEmpty()) {

    return res.status(400).json({
        success:false,
        msg:'Errors',
        errors: errors.array()
    });
}
    const { email , password} = req.body;
    const shopper = await Shopper.findOne({ email });
    if (!shopper) {
        return res.status(400).json({
            success:false,
            msg:'Email and Password is Incorrect... !',
           
        });
    }

    const passwordMatch = await bcrypt.compare(password, shopper.password);
    if (!passwordMatch) {
        return res.status(400).json({
            success:false,
            msg:'Email and Password is Incorrect !',
           
        });
    }

    const token =jwt.sign({id:shopper._id,is_shopper : shopper.is_shopper},process.env.JWT_SECRET_KEY,{ expiresIn: '2h' });
    // const accessToken = await generateAccessToken({ shopper: shopper_Data });
    return res.status(200).json({
      success: true,
      msg: 'Login successfully!',
      shopper: shopper,
      accessToken: token,
      tokenType: 'Bearer'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message
    });
  }
};
const getShopper = factory.getOne_shopper(Shopper);
////////////////////////////////////////////////////////
const deleteShopper = factory.deleteOne_shopper(Shopper);
/////////////////////////////////////////////////////////////////////
const getprofile =asyncHandler(async (req, res, next) => {
  const  id  = req.shopper.id;

  // 1) Build query
  const query =  await  Shopper.findById(id);

  // 2) Execute query


 
  if (!query) {
    res.status(404).json({success:false, message: 'you do not shopper'});
  }
  res.status(200).json({success:true, data: query});
});
//////////////////////////////////////////////////////////////////////
const updateshopper = async (req, res) => {
  try{
 
  const errors = validationResult(req);
if (!errors.isEmpty()) {

    return res.status(400).json({
        success:false,
        msg:'Errors',
        errors: errors.array()
    });
}
const{email,mobile,name}= req.body;
const data= {
  email,
  mobile,
  name,
}

  if(req.file !==undefined){
    data.image = 'image/'+req.file.filename;
  }
  const shopper_info =await Shopper.findByIdAndUpdate(req.shopper.id,{
    $set:data
  },{new:true});
  if(!shopper_info){
    res.status(404).json({success:false, message: 'you do not shopper'});
  }
  return res.status(200).json({
    success:true,
    message:'Shopper updated successfully',
    name:shopper_info.name,
    event_name:shopper_info.event_name,
    email:shopper_info.email,
    image:shopper_info.image,
    mobile:shopper_info.mobile,
    location:shopper_info.location,
  });
  }catch(error){
    return res.status(400).json({
      success:false,
      message:error.message
    });
  }

};
/////
const updateEventName = async (req, res) => {
  try{
 
  const errors = validationResult(req);
if (!errors.isEmpty()) {

    return res.status(400).json({
        success:false,
        msg:'Errors',
        errors: errors.array()
    });
}
const event_name = req.body.event_name;
  const shopper_info =await Shopper.findByIdAndUpdate(req.shopper.id,{
    event_name:event_name
  },{new:true});
  if(!shopper_info){
    res.status(404).json({success:false, message: 'you do not shopper'});
  }
  return res.status(200).json({
    success:true,
    message:'event_name updated successfully',
    Event_Name:shopper_info.event_name,
  });
  }catch(error){
    return res.status(400).json({
      success:false,
      message:error.message
    });
  }

};
///////
const updatelocation = async (req, res) => {
  try{
 
  const errors = validationResult(req);
if (!errors.isEmpty()) {

    return res.status(400).json({
        success:false,
        msg:'Errors',
        errors: errors.array()
    });
}
const location = req.body.location;
  const shopper_info =await Shopper.findByIdAndUpdate(req.shopper.id,{
    location:location
  },{new:true});
  if(!shopper_info){
    res.status(404).json({success:false, message: 'you do not shopper'});
  }
  return res.status(200).json({
    success:true,
    message:'location updated successfully',
    location:shopper_info.location,
  });
  }catch(error){
    return res.status(400).json({
      success:false,
      message:error.message
    });
  }

};
////
const getlocation = async (req, res) => {
  try{
 
  const errors = validationResult(req);
if (!errors.isEmpty()) {

    return res.status(400).json({
        success:false,
        msg:'Errors',
        errors: errors.array()
    });
}
  const id = req.shopper.id;
  const shopper_info =await Shopper.findById(id);
  if(!shopper_info){
    res.status(404).json({success:false, message: 'you do not shopper'});
  }
  return res.status(200).json({
    success:true,
    message:' get location successfully',
    location:shopper_info.location,
  });
  }catch(error){
    return res.status(400).json({
      success:false,
      message:error.message
    });
  }

};
/////
const changeShopperPassword = async (req, res) => {
  
  // 1) Verify current password
  const shopper = await Shopper.findById(req.shopper.id);
  if (!shopper) {
    return res.status(404).json({success:false,message:`There is no shopper `});
  }
  const isCorrectPassword = await bcrypt.compare(
    req.body.currentPassword,
    shopper.password
  );
  if (!isCorrectPassword) {
    return res.status(404).json({success:false,message:`Incorrect current password`});
  }

  // 2) Verify password confirm
  if ( req.body.newpassword !== req.body.passwordConfirm) {
    return res.status(404).json({success:false,message:`Password Confirmation incorrect`});
  }

const document = await Shopper.findByIdAndUpdate(
  req.shopper.id,
  {
    password: await bcrypt.hash(req.body.newpassword, 10),
    passwordChangedAt: Date.now(),
  },
  {
    new: true,
  }
);


res.status(200).json({ success:true,message:'password updata successfully',Time:document.passwordChangedAt });
}
/////////////////////////////////////////////////////////////////////////////
const forgotPassword = async (req, res) => {
// 1) Get user by email

const shopper = await Shopper.findOne({email:req.body.email});
;
if (!shopper) {
  return res.status(404).json({success :'false', message :`There is no shopper with that email ${req.body.email}`})
}
else{
const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
const hashedResetCode = crypto
  .createHash('sha256')
  .update(resetCode)
  .digest('hex');

// Save hashed password reset code into db
shopper.passwordResetCode = hashedResetCode;
// Add expiration time for password reset code (10 min)
shopper.passwordResetExpires = Date.now() + 10 * 60 * 1000;
shopper.passwordResetVerified = false;

await shopper.save();
res
 .status(200)
 .json({ status: 'Success', message: resetCode,Time:shopper.passwordResetExpires });
}};
//////////////////////////////////////////////////////////////////////
const verifyPassResetCode = async (req, res) => {
// 1) Get user based on reset code
const hashedResetCode = crypto
  .createHash('sha256')
  .update(req.body.resetCode)
  .digest('hex');

const shopper = await Shopper.findOne({
  passwordResetCode: hashedResetCode,
  passwordResetExpires: { $gt: Date.now() },
});
if (!shopper) {
  return res.json({success:false,message : 'Reset code invalid or expired'});
}

// 2) Reset code valid
shopper.passwordResetVerified = true;
await shopper.save();

res.status(200).json({
  status: 'Success',
});
};
////////////////////////////////////////////////////////
const resetPassword =async (req, res) => {
// 1) Get user based on email
const shopper = await Shopper.findById(req.shopper.id);
if (!shopper) {
  
  return res.status(404).json({success:false,message:`There is no shopper with email ${shopper.email}`})
}

// 2) Check if reset code verified
if (!shopper.passwordResetVerified) {

  return res.status(404).json({success:false,message:'Reset code not verified'})
}
const hashPassword = await  bcrypt.hash(req.body.newPassword,10);
shopper.password = hashPassword;
shopper.passwordResetCode = undefined;
shopper.passwordResetExpires = undefined;
shopper.passwordResetVerified = undefined;

await shopper.save();

// 3) if everything is ok, generate token
const token =jwt.sign({id:shopper._id,is_shopper : shopper.is_shopper},process.env.JWT_SECRET_KEY,{ expiresIn: '2h' });
res.status(200).json({ success:true,token:token});
};
//////////////////
const logout =async (req, res) => {
  try{
  const bearertoken = req.headers.token;
  const newBlacklist = new Blacklist({token:bearertoken});
  await newBlacklist.save();
  res.setHeader('Clear-Site-Data','"cookies","storage"');
  return res.status(200).json({
    success:true,
    message:'You are logged out!'
  });


  } catch(error){
    return res.status(400).json({
      success:false,
      message:error.message
    });
  } 


  };

 module.exports = {
    registershopper,
    loginshopper,
    updateshopper,
    forgotPassword,
    verifyPassResetCode,
    resetPassword,
    getShopper,
    getprofile,
    deleteShopper,
    changeShopperPassword,
    logout,
    infoshopper,
    updatelocation,
    getlocation,
    updateEventName
 }