const mongoose = require('mongoose');

 const userSchema =  new mongoose.Schema({
  
     name:{
        type:String,
        required:true
     },
     email:{
        type:String,
        required:true
     },
     mobile:{
        type:String,
        required:true
     },
     password:{
        type:String,
        required:true
     },
    location:{
      type:String,
      required:true
    },
     image:{
        type:String,
        required:true
     },
     is_user :{
      type:Boolean,
      default:true
     },
      event_type:{
      type: String,
      required:true,
      enum:
       {values: ['Wedding Hall', 'Candies shop', 'Decoration shop','Hotal','Car rental shop','Restorant'],
       message:`event_type must be one of : Wedding Hall,Candies shop, Decoration shop,Hotal,Car rental shop,Restorant'`
   },
      
     },
     passwordChangedAt: Date,
     passwordResetCode: String,
     passwordResetExpires: Date,
     passwordResetVerified: Boolean,
     
},{ timestamps: true });
userSchema.methods.generateToken = function () {
   const token = jwt.sign({_id:this._id,isAdmin:this.isAdmin}, "privatkey")
   return token;
}



module.exports = mongoose.model("User" , userSchema);