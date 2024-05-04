const Admin  = require('../models/adminModels');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const crypto = require('crypto');
const User  = require('../models/userModels');
const Blacklist = require('../models/blacklistModels');
////////////////
const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const ApiError = require('../utile/apiError');
const Shopper= require('../models/shopperModels');
 //const mailer = require('../helpers/mailer');


 const jwt = require('jsonwebtoken');
const loginAdmin = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          msg: 'Errors',
          errors: errors.array()
        });
      }
      const { email, password } = req.body;
      const adminData = await Admin.findOne({ email:req.body.email});
      if (!adminData) {
        return res.status(400).json({
          success: false,
          msg: 'Email and Password is Incorrect...!',
        });
      }

      // const passwordMatch = await bcrypt.compare(password, adminData.password);
      // if (!passwordMatch) {
      //   return res.status(400).json({
      //     success: false,
      //     msg: 'Email and Password is Incorrect!',
      //   });
      // }
    const token =jwt.sign({id:adminData._id,is_admin : adminData.is_admin},process.env.JWT_SECRET_KEY,{ expiresIn: '2h' });
      return res.status(200).json({
        success: true,
        message: 'Login successfully!',
        name:adminData.name,
        mobile:adminData.mobile,
        email:adminData.email,
        accessToken:token,
        tokenType: 'Bearer'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        msg: error.message
      });
  
  };}
  const getUser_admin = async (req, res) => {
    const { id } = req.params;
    if(!req.admin.is_admin ){
      return res.status(403).json({message : ' invalid token,the token is private with admin'});
    }
    // // 1) Build query
  
   
    // 2) Execute query
    const document = await User.findById(id);

    if (!document) {
      res.status(404).json({  success:false, message: 'you do not user by id'});
    }
    res.status(200).json({success:true, data: document });
  };
  //////////////////////////////////////////////////////////////////
 const deleteUser_admin= async (req, res) => {
  const { id } = req.params;
  if(!req.admin.is_admin ){
    return res.status(403).json({message : ' invalid token,the token is private with admin'});
  }
   
   // Find and delete the document with the given ID
   const document = await User.findByIdAndDelete(id);

   if (!document) {
     return res.status(404).json({ success :'false' ,message: ' you dont have any user '});
   }

   // Return a 204 response on successful deletion
   res.status(200).json( {success:'true', message:'Deleted succass'});
 }
////
const getall_users = asyncHandler(async (req, res, ) => {

  const admin = await Admin.findById(req.admin.id);
  if (!admin) {
    return res.status(404).json({success:false,message:`There is no admin `});
  }
  const count = await User.find().countDocuments();
  const user = await User.find().sort('name').select(['name','mobile','email','image','location','createdAt']);
  res.status(200).json({success:true,message:`you have ${count} of users`,user:user});
})
/////

const getall_shoppers = asyncHandler(async (req, res, ) => {

  const admin = await Admin.findById(req.admin.id);
  if (!admin) {
    return res.status(404).json({success:false,message:`There is no admin `});
  }
  const count = await Shopper.find().countDocuments();
  const shopper = await Shopper.find().sort('name').select(['name','mobile','email','image','event_name','location','createdAt']);
  res.status(200).json({success:true,message:`you have ${count} of shoppers`,shopper:shopper});
})
///
const getcount_shoppers = asyncHandler(async (req, res, ) => {

  const admin = await Admin.findById(req.admin.id);
  if (!admin) {
    return res.status(404).json({success:false,message:`There is no admin `});
  }
  const count = await Shopper.find().countDocuments();
  res.status(200).json({success:true,message:`you have ${count} of shoppers`});
})
////
const getcount_users = asyncHandler(async (req, res, ) => {

  const admin = await Admin.findById(req.admin.id);
  if (!admin) {
    return res.status(404).json({success:false,message:`There is no admin `});
  }
  const count = await User.find().countDocuments();
  res.status(200).json({success:true,message:`you have ${count} of shoppers`});
})
 ////
 const changeAdminPassword = async (req, res) => {
  
  // 1) Verify current password
  const admin = await Admin.findById(req.admin.id);
  if (!admin) {
    return res.status(404).json({success:false,message:`There is no admin `});
  }
  const isCorrectPassword = await bcrypt.compare(
    req.body.currentPassword,
    admin.password
  );
  if (!isCorrectPassword) {
    return res.status(404).json({success:false,message:`Incorrect current password`});
  }

  // 2) Verify password confirm
  if ( req.body.newpassword !== req.body.passwordConfirm) {
    return res.status(404).json({success:false,message:`Password Confirmation incorrect`});
  }

const document = await Admin.findByIdAndUpdate(
  req.admin.id,
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
 /////////////////////////////////////////////////////////////////////////
 const forgotPassword = async (req, res) => {
  // 1) Get user by email

  const admin = await Admin.findOne({email:req.body.email});
;
  if (!admin) {
    return res.status(404).json({success :'false', message :`There is no admin with that email ${req.body.email}`})
  }
  else{
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // Save hashed password reset code into db
  admin.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  admin.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  admin.passwordResetVerified = false;

  await admin.save();
  res
   .status(200)
   .json({ status: 'Success', message: resetCode,Time:admin.passwordResetExpires });
}};
//////////////////////////////////////////////////////////////////////
const verifyPassResetCode = async (req, res) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const admin = await Admin.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!admin) {
    return res.json({success:false,message : 'Reset code invalid or expired'});
  }

  // 2) Reset code valid
  admin.passwordResetVerified = true;
  await admin.save();

  res.status(200).json({
    status: 'Success',
  });
};
////////////////////////////////////////////////////////
const resetPassword =async (req, res) => {
  // 1) Get user based on email
  const admin = await Admin.findById(req.user.id);
  if (!admin) {
  
    return res.status(404).json({success:false,message:`There is no admin with email ${admin.email}`})
  }

  // 2) Check if reset code verified
  if (!admin.passwordResetVerified) {
  
    return res.status(404).json({success:false,message:'Reset code not verified'})
  }
  const hashPassword = await  bcrypt.hash(req.body.newPassword,10);
  admin.password = hashPassword;
  admin.passwordResetCode = undefined;
  admin.passwordResetExpires = undefined;
  admin.passwordResetVerified = undefined;

  await admin.save();

  // 3) if everything is ok, generate token
  const token =jwt.sign({id:admin._id,is_admin : admin.is_admin},process.env.JWT_SECRET_KEY,{ expiresIn: '2h' });
  res.status(200).json({ success:true,token:token});
};

////res.status(200).json({success:true,message:`${document.name} loggout successfully`})
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
  const getprofile =asyncHandler(async (req, res, next) => {
    const  id  = req.admin.id;

    // 1) Build query
    let query = Admin.findById(id);
   

    // 2) Execute query
    const document = await query;

    if (!document) {
      res.status(404).json({  success:false, message: 'you do not admin'});
    }
    res.status(200).json({success:true, data: document });
  });
  ////////////////

  const updateAdmin = async (req, res) => {
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
    const admin_info =await Admin.findByIdAndUpdate(req.admin.id,{
      $set:data
    },{new:true});
    if(!admin_info){
      res.status(404).json({success:false, message: 'you do not admin'});
    }
    return res.status(200).json({
      success:true,
      message:'admin updated successfully',
      name:admin_info.name,
      email:admin_info.email,
      image:admin_info.image,
      mobile:admin_info.mobile,
    });
    }catch(error){
      return res.status(400).json({
        success:false,
        message:error.message
      });
    }
  
  };
  ///
  const search_shoppers = asyncHandler(async (req, res, ) => {

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({success:false,message:`There is no admin `});
    }
    const name = req.query.event_name;
    const shopper = await Shopper.findOne({event_name:name}).select(['name','mobile','email','image','event_name','location','createdAt']);
    if (!shopper) {
      return res.status(404).json({success:false,message:`There is not shopper `});
    }
    res.status(200).json({success:true,message:`you own a shopper whose data is `,data:shopper});
  })
  ///
  const search_users = asyncHandler(async (req, res, ) => {

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({success:false,message:`There is no admin `});
    }
    const name = req.query.name;
    const user = await User.findOne({name:name}).select(['name','mobile','email','image','location','createdAt']);
    if (!user) {
      return res.status(404).json({success:false,message:`There is not user `});
    }
    res.status(200).json({success:true,message:`you own a user whose data is `,data:user});
  })






 module.exports = {
   
    loginAdmin,
    deleteUser_admin ,
    getUser_admin,
    forgotPassword,
    verifyPassResetCode,
    resetPassword,
    changeAdminPassword ,
    logout, 
    getprofile ,
    updateAdmin,
    getall_shoppers,
    getall_users ,
    getcount_users,
    getcount_shoppers,
    search_shoppers,
    search_users
  

 }