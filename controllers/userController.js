const User  = require('../models/userModels');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
////////////////
const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const crypto = require('crypto');

const ApiError = require('../utile/apiError');

const Blacklist = require('../models/blacklistModels');

 const jwt = require('jsonwebtoken');
const userRegister = async(req,res) => {

    try{

      const errors =  validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
            success:false,
            msg:  'Errors',
            errors: errors.array()
        
        });
      }
        const {name, email, mobile, password,location,event_type} = req.body;


const isExists = await User.findOne({email});

if(isExists){
    return res.status(400).json({
        success:false,
        msg:  'email Already Exists!'
    
    });
}
       const hashPassword = await  bcrypt.hash(password,10);
  
       const user =  new User(
            {
                name,
                email,
                mobile,
                password:hashPassword,
                image:'images/'+req.file.filename,
                location,
                event_type,
            }
          )

           const userData = await user.save();
            

        
           const token =jwt.sign({id:user._id,is_user : user.is_user,event_type:user.event_type},process.env.JWT_SECRET_KEY,{ expiresIn: '2h' });

           return res.status(200).json({
            success:true,
            msg: 'Registered successfuly!',
            user:userData,
            accessToken: token,
             tokenType: 'Bearer'
        });
    }catch(error){
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}

const loginUser = async (req, res) => {
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
      const userData = await User.findOne({ email });
      if (!userData) {
        return res.status(400).json({
          success: false,
          msg: 'Email and Password is Incorrect...!',
        });
      }
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (!passwordMatch) {
        return res.status(400).json({
          success: false,
          msg: 'Email and Password is Incorrect!',
        });
      }
   
      const token =jwt.sign({id:userData._id,is_user : userData.is_user},process.env.JWT_SECRET_KEY,{ expiresIn: '2h' });
      return res.status(200).json({
        success: true,
        msg: 'Login successfully!',
        user: userData,
        accessToken: token,
        tokenType: 'Bearer'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        msg: error.message
      });
    }
  }/////////////////////////////////////////////////////////////////
  const getUser = factory.getOne(User);
  ////////////////////////////////////////////////////////
  const deleteUser = factory.deleteOne(User);
  /////////////////////////////////////////////////////////////////////
  const getprofile =asyncHandler(async (req, res, next) => {
    const  id  = req.user.id;

    // 1) Build query
    let query = User.findById(id);
 

    // 2) Execute query
    const document = await query;

    if (!document) {
      res.status(404).json({  success:false, message: 'you do not user'});
    }
    res.status(200).json({success:true, data: document });
  });

  
 

  //////////////////////////////////////////////////////////////////////
  const updateUser = async (req, res) => {
  
    try{
 
      const errors = validationResult(req);
    if (!errors.isEmpty()) {
    
        return res.status(400).json({
            success:false,
            msg:'Errors',
            errors: errors.array()
        });
    }
    const{ name,email,mobile}= req.body;
    const data= {
      name,
      email,
      mobile,
    }
    
      if(req.file !==undefined){
        data.image = 'image/'+req.file.filename;
      }
      const user_info =await User.findByIdAndUpdate(req.user.id,{
        $set:data
      },{new:true});
     
    
    
      return res.status(200).json({
        success:true,
        message:'User updated successfully',
        name:user_info.name,
        email:user_info.email,
        image:user_info.image,
        mobile:user_info.mobile,
      });
      }catch(error){
        return res.status(400).json({
          success:false,
          message:error.message
        });
      }
    
 };
 ////////////////////////////////////////////////////////////////////////////
 const changeUserPassword = async (req, res) => {
  
    // 1) Verify current password
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({success:false,message:`There is no user `});
    }
    const isCorrectPassword = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!isCorrectPassword) {
      return res.status(404).json({success:false,message:`Incorrect current password`});
    }

    // 2) Verify password confirm
    if ( req.body.newpassword !== req.body.passwordConfirm) {
      return res.status(404).json({success:false,message:`Password Confirmation incorrect`});
    }

  const document = await User.findByIdAndUpdate(
    req.user.id,
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

  const user = await User.findOne({email:req.body.email});
;
  if (!user) {
    return res.status(404).json({success :'false', message :`There is no user with that email ${req.body.email}`})
  }
  else{
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();
  res
   .status(200)
   .json({ status: 'Success', message: resetCode,Time:user.passwordResetExpires });
}};
//////////////////////////////////////////////////////////////////////
const verifyPassResetCode = async (req, res) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.json({success:false,message : 'Reset code invalid or expired'});
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: 'Success',
  });
};
////////////////////////////////////////////////////////
const resetPassword =async (req, res) => {
  // 1) Get user based on email
  const user = await User.findById(req.user.id);
  if (!user) {
    
    return res.status(404).json({success:false,message:`There is no user with email ${user.email}`})
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
  
    return res.status(404).json({success:false,message:'Reset code not verified'})
  }
  const hashPassword = await  bcrypt.hash(req.body.newPassword,10);
  user.password = hashPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token =jwt.sign({id:user._id,is_user : user.is_user},process.env.JWT_SECRET_KEY,{ expiresIn: '2h' });
  res.status(200).json({ success:true,token:token});
};
////
const logoutuser =async (req, res) => {
  try{
  const bearertoken = req.headers.token;
  const newBlacklist = new Blacklist({token:bearertoken});
  await newBlacklist.save();
  return res.setHeader('Clear-Site-Data','"cookies","storage"');
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

//////////////////////////

 module.exports = {
    userRegister,
    loginUser,
    updateUser,
    forgotPassword,
    verifyPassResetCode,
    resetPassword,
    getUser,
    getprofile,
    deleteUser,
    changeUserPassword,
    logoutuser,
 
 }