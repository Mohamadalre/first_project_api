// const slugify = require('slugify');
const bcrypt = require('bcrypt');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModels');

exports.registerValidator =[
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
   
  }
),    
check('event_type','Event is required').notEmpty().withMessage('event_type must be one of : Wedding Hall,Candies shop, Decoration shop,Hotal,Car rental shop,Restorant'),
  check('location').notEmpty()
.withMessage('location required'),
  check('image').custom((value,{req}) => {
      if(req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {

return true;
      }
      else{ return false;}
  }).withMessage('please upload an image Jpag, PNG'),

];
/////////////////////////////////////////
exports.loginValidator = [
  check('email','please enter a valid  email').isEmail().normalizeEmail({
      gmail_remove_dots:true,

  }),
  check('password','password  is required ').not().isEmpty(),
];
//////////////////////////////////////////////
exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];

////////////////////////////////////////////////
exports.updateUserValidator = [
 
  check('name').not().isEmpty().optional,
 
   
 check('email').optional().isEmail()
 
 ,
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

exports.changeUserPasswordValidator = [
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

exports.deleteUserValidator = [
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

// exports.updateLoggedUserValidator = [
//   body('name')
//     .optional()
//     .custom((val, { req }) => {
//       req.body.slug = slugify(val);
//       return true;
//     }),
//   check('email')
//     .notEmpty()
//     .withMessage('Email required')
//     .isEmail()
//     .withMessage('Invalid email address')
//     .custom((val) =>
//       User.findOne({ email: val }).then((user) => {
//         if (user) {
//           return Promise.reject(new Error('E-mail already in user'));
//         }
//       })
//     ),
//   check('phone')
//     .optional()
//     .isMobilePhone(['ar-EG', 'ar-SA'])
//     .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

//   validatorMiddleware,
// ];
