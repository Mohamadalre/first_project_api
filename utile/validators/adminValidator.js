const bcrypt = require('bcrypt');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Admin = require('../../models/adminModels');

exports.loginadminValidator = [
    check('email','please enter a valid  email').isEmail().normalizeEmail({
        gmail_remove_dots:true,
  
    }),
    check('password','password  is required ').not().isEmpty(),
    validatorMiddleware
  ];
  ///
  exports.changeAdminPasswordValidator = [
    body('currentPassword')
      .notEmpty()
      .withMessage('You must enter your current password'),
    body('passwordConfirm')
      .notEmpty()
      .withMessage('You must enter the password confirm'),
    body('newpassword')
      .notEmpty()
      .withMessage('You must enter new password'),
     
    validatorMiddleware,
  ];
  
  exports.updateAdminValidator = [
 
    check('name').not().isEmpty().optional(), 
    check('email') .isEmail().optional(),
    check('mobile','Mobile No. should be contains 10 digits')
  .isLength({
  min:10,
  max:20
}).optional(),

check('image') .optional().custom((value,{req}) => {
  if(req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {

return true;
  }
  else{ return false;}
}).withMessage('please upload an image Jpag, PNG'),



  validatorMiddleware,
  ];
 