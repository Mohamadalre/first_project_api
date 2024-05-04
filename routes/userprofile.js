const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/userModels');
const {
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  forgotPasswordValidator,
  changeUserPasswordValidator,

} = require('../utile/validators/userValidator');

  const path = require('path');
 const multer = require('multer');
 
  const storage = multer.diskStorage({
    destination: function(req,file ,cb){
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
            cb(null, path.join(__dirname, '../public/images'));

            
        }
        
    },
    filename: function(req,file, cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
 });


 const fileFilter = (req,file,cb) => {
  
    if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null,true);
        
    }else{
        cb(null,false);
    }
 }
 const upload = multer({
    
    storage:storage,
    fileFilter:fileFilter

}); 

router.use(express.json());
 router.use(verifyToken.verifyTokenuser);
 const userController = require('../controllers/userController');
 const adminController = require('../controllers/adminController');





 //delete with user of user by  id
router.delete('/delete_user/:id',deleteUserValidator,userController.deleteUser);
 /// get with user of user by id
router.get('/get_user/:id',getUserValidator, userController.getUser);
 /// updata profile of user by id without password 
router.put('/updata_user',upload.single('image'),updateUserValidator, userController.updateUser);
//////////////////////////////////////////////
router.post('/forgotPassword',forgotPasswordValidator,userController.forgotPassword);
//////////////////////////////////////////////
router.post('/verifyResetCode', userController.verifyPassResetCode);
//////////////////////////////////////////////
router.put('/resetPassword',userController.resetPassword);
////////////////////////////////////////////////////////////////////
router.get('/get_pro',userController.getprofile);
/////////////////////////////////////////////////////////////////////
router.put('/changeMyPassword',changeUserPasswordValidator,userController.changeUserPassword );
/////
router.get('/logout',userController.logoutuser);


module.exports = router;    