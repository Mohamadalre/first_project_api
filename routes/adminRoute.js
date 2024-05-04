const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/userModels');
const Admin = require('../models/adminModels');
const validatorMiddleware = require('../middlewares/validatorMiddleware');

const{
  getUserValidator,
  deleteUserValidator,
  forgotPasswordValidator,

  
  

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

const adminValidator = require('../utile/validators/adminValidator');

router.use(express.json());

 const userController = require('../controllers/userController');
 const adminController = require('../controllers/adminController');
// const {registerValidator,loginValidator} = require('../utile/validators/userValidator');

// router.post('/login',loginValidator, adminController.loginAdmin);

router.use(verifyToken.verifyTokenAdmin);

 //delete with user of user by  id
 router.delete('/delete_user/:id',deleteUserValidator, adminController.deleteUser_admin);
 /// get with user of user by id
router.get('/get_user/:id',getUserValidator, adminController.getUser_admin);
////////////////////////////////
router.post('/forgotPassword',forgotPasswordValidator,adminController.forgotPassword);
//////////////////////////////////////////////
router.post('/verifyResetCode', adminController.verifyPassResetCode);
//////////////////////////////////////////////
router.put('/resetPassword',adminController.resetPassword);
////////////////////////////////////////////////////////////////////
router.put('/changeMyPassword',adminValidator.changeAdminPasswordValidator,adminController.changeAdminPassword );
///
router.get('/get_pro',adminController.getprofile);
router.put('/updata_admin',upload.single('image'),adminValidator.updateAdminValidator, adminController.updateAdmin);
router.get('/logout',adminController.logout);
router.get('/getall_users',adminController.getall_users);
router.get('/getall_shoppers',adminController.getall_shoppers);
router.get('/getcount_shoppers',adminController.getcount_shoppers);
router.get('/getcount_users',adminController.getcount_users);
router.get('/search_shoppers',adminController.search_shoppers);
router.get('/search_users',adminController.search_users);
module.exports = router;    