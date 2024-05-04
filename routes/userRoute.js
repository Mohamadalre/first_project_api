const express = require('express');
const router = express();
router.use(express.json());


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

 const userController = require('../controllers/userController');
 const adminController = require('../controllers/adminController');
const {registerValidator,loginValidator} = require('../utile/validators/userValidator');


router.post('/admin/login',loginValidator, adminController.loginAdmin);
// router.post('/register', upload.single('image'), userController.userRegister);
 router.post('/register', upload.single('image'),registerValidator, userController.userRegister);

 router.post('/login', loginValidator, userController.loginUser);
 
 

;


module.exports = router;    