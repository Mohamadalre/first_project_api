const mongoose = require('mongoose');

 const adminSchema =  new mongoose.Schema({
  
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
     is_admin:{
      type:Boolean,
      default:true
     },
     
     image:{
      type:String,
   },
     passwordChangedAt: Date,
     passwordResetCode: String,
     passwordResetExpires: Date,
     passwordResetVerified: Boolean,
    
    
},{ timestamps: true });
adminSchema.methods.generateToken = function () {
   const token = jwt.sign({_id:this._id,isAdmin:this.isAdmin}, "privatkey")
   return token;
}
module.exports = mongoose.model("Admin" , adminSchema);