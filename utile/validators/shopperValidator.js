const bcrypt = require('bcrypt');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Shopper = require('../../models/shopperModels');

exports.registerValidatorshopper =[

  check('name','Name is required').not().isEmpty(),

 
  check('email','please enteer a valid  email').isEmail().normalizeEmail({
      gmail_remove_dots:true,

  }),
  check('mobile','Mobile No. should be contains 10 digits').isLength({
      min:10,
      max:20
  }),
  check('password','Password must greater than 6 characters, and cintains at least one at  uppercase letter, one lowercase letter, and one number, and one  special character')
  .isStrongPassword({
  minLength:6,
   //minUppercase:1,
   //minLowercase:1,
   //minNumbers:1,
  
  }),

];
exports.infoValidatorshopper =[
  check('event_name','Name is required').not().isEmpty(),
  check('location').notEmpty()
  .withMessage('location required'),

  check('image').custom((value,{req}) => {
    if(req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {

return true;
    }
    else{ return false;}
}).withMessage('please upload an image Jpag, PNG'),
validatorMiddleware,

];
exports.loginValidatorshopper = [
  check('email','please enter a valid  email').isEmail().normalizeEmail({
      gmail_remove_dots:true,

  }),
  check('password','password  is required ').not().isEmpty(),
  
];



exports.deleteshopperValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
  ];
  
  exports.forgotPasswordValidator= [
  
    check('email')
      .notEmpty()
      .withMessage('Email required')
      .isEmail()
      .withMessage('Invalid email address')
    ,
    validatorMiddleware,
  ];
  
  exports.getshopperValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
  ];
  
  ////////////////////////////////////////////////
  exports.updateshopperValidator = [
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
  

  exports.updateEventNameValidator=[
    check('event_name').not().isEmpty(), 

  validatorMiddleware,
  ];
  //
  exports.updatelocationValidator=[
    check('location').notEmpty()
    .withMessage('location required'),
  
    validatorMiddleware,
    ];
  ////
  exports.changeShopperPasswordValidator = [
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
  