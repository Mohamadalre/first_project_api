const express = require('express');
const router = express();
const verifyToken = require('../middlewares/verifyToken');
const shopper=require('../models/shopperModels');
const bcrypt = require('bcrypt');
const User = require('../models/userModels');
const Admin = require('../models/adminModels');



 const path = require('path');
 const multer = require('multer');
 router.use(express.json());
 const {
    getshopperValidator,
    updateshopperValidator,
    deleteshopperValidator,
    forgotPasswordValidator,
    registerValidatorshopper,
    loginValidatorshopper,
    changeShopperPasswordValidator,
    infoValidatorshopper,
    updatelocationValidator,
    updateEventNameValidator
  } = require('../utile/validators/shopperValidator');
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


 const shopperController = require('../controllers/shopperController');
 router.post('/registershopper',registerValidatorshopper, shopperController.registershopper);
 router.post('/loginshopper', loginValidatorshopper, shopperController.loginshopper);
 router.use(verifyToken.verifyTokenShopper);
 ////
router.post('/data_with_event',upload.single('image'),infoValidatorshopper, shopperController.infoshopper);
  //delete with shopper of shopper by  id
router.delete('/delete_shopper/:id',deleteshopperValidator,shopperController.deleteShopper);
/// get with shopper of shopper by id
router.get('/get_shopper/:id',getshopperValidator,shopperController.getShopper);
/// updata profile of shopper by id without password 
router.put('/updata_shopper',upload.single('image'),updateshopperValidator,shopperController.updateshopper);
//////////////////////////////////////////////
router.post('/forgotPassword',forgotPasswordValidator,shopperController.forgotPassword);
//////////////////////////////////////////////
router.post('/verifyResetCode', shopperController.verifyPassResetCode);
//////////////////////////////////////////////
router.put('/resetPassword',shopperController.resetPassword);
////////////////////////////////////////////////////////////////////
router.get('/get_pro',shopperController.getprofile);
/////////////////////////////////////////////////////////////////////
router.put('/changeMyPassword',changeShopperPasswordValidator,shopperController.changeShopperPassword );
///updatelocation 
router.put('/changeMylocation',updatelocationValidator,shopperController.updatelocation);
//
router.get('/getMylocation',shopperController.getlocation);
//updateEventName updateEventNameValidator
router.put('/changeEventName',updateEventNameValidator,shopperController.updateEventName);
//
router.put('/logout',shopperController.logout);

module.exports = router;    