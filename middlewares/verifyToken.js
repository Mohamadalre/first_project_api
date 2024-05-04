
const jwt = require('jsonwebtoken');
const admin = require('../models/adminModels');
const shopper = require('../models/shopperModels');
const Blacklist = require('../models/blacklistModels');
function verifyTokenuser(req,res,next){
  const token = req.headers.token;
  if(token){
    try{
    //   const document = Blacklist.findOne({token: token});
    //   if(document){ res.status(401).json({message :'invalid token'});}
      const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
      req.user= decoded;
      next();
    }catch(error){
      res.status(401).json({message :'invalid token'});
    }
  }else{
    res.status(401).json({message:'no token provided'});
  }
}//////////l
/////////////////////////////////////////////////////
function verifyTokenAdmin (req,res,next){

  const token = req.headers.token;
  if(token){
    try{
      // const document = Blacklist.findOne({token: token});
      // if(document){ res.status(401).json({message :'invalid token'});}
      const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
      req.admin= decoded;
      next();
    }catch(error){
      res.status(401).json({message :'invalid token'});
    }
  }else{
    res.status(401).json({message:'no token provided'});
  }
}
////////////////////////////////////////////
function verifyTokenShopper(req,res,next){
  const token = req.headers.token;
  if(token){
    try{
      // const document = Blacklist.findOne({token: token});
      // if(document){ res.status(401).json({message :'invalid token'});}
      const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
      req.shopper= decoded;
      next();
    }catch(error){
      res.status(401).json({message :'invalid token'});
    }
  }else{
    res.status(401).json({message:'no token provided'});
  }}
  ////

 
  
module.exports = {
  verifyTokenuser,
  verifyTokenAdmin,
  verifyTokenShopper,
  
  
};