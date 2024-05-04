const mongoose = require('mongoose');

 const shopperSchema =  new mongoose.Schema({
  
     event_name:{
        type:String,
     },
     name:{
      type:String,
      required:true},
     email:{
        type:String,
        required:true,
        unique: true,
     },
     mobile:{
        type:String,
        required:true,
     },
     password:{
        type:String,
        required:true
     },
     is_verified:{
        type:Number,
        default:0
     },
     image:{
        type:String,
        
     },
     
     location:{
      type:String,
     },
     is_shopper:{
      type:Boolean,
      default:true
     },
     passwordChangedAt: Date,
     passwordResetCode: String,
     passwordResetExpires: Date,
     passwordResetVerified: Boolean,
},{ timestamps: true });
  
module.exports = mongoose.model("Shopper" , shopperSchema);