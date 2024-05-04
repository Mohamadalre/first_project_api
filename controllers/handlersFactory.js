const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const ApiError = require('../utile/apiError');
const verifyToken = require('../middlewares/verifyToken');
const User  = require('../models/userModels');
const Admin  = require('../models/adminModels');
const { log } = require('console');
/**const User  = require('../models/userModels');
 * A generic function to delete a document from a given Model by its ID
 * @param {Object} Model - The Mongoose Model to perform the delete operation on
 * @returns {Function} - An async function that handles the delete request
 */////////////////////////////////////////////////////////////////////////////
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params; // Extract the ID from the request parameters
    if(req.user.id!== req.params.id){
      return res.status(403).json({message : 'invalid token or id of user'});
    }
    // Find and delete the document with the given ID
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return res.status(404).json({ success :'false' ,message: ' you dont have any user '});
    }

    // Return a 204 response on successful deletion
    res.status(200).json( {success:'true', message:'Deleted succass'});
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  exports.deleteOne_shopper = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params; // Extract the ID from the request parameters
    if(req.shopper.id!== req.params.id){
      return res.status(403).json({message : 'invalid token or id of shopper'});
    }
    // Find and delete the document with the given ID
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return res.status(404).json({ success :'false' ,message: ' you dont have any shopper '});
    }

    // Return a 204 response on successful deletion
    res.status(200).json( {success:'true', message:'Deleted succass'});
  });
////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if(req.user.id!== req.params.id){
      return res.status(403).json({message : ' invalid token or id of user'});
    }
    // 1) Build query
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    // 2) Execute query
    const document = await query;

    if (!document) {
      res.status(404).json({success:false, message: 'you do not user by id'});
    }
    res.status(200).json({success:true ,data: document });
  });
  //////////////////////////////////////////////
  exports.getOne_shopper = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if(req.shopper.id!== req.params.id){
      return res.status(403).json({message : ' invalid token or id of shopper'});
    }
    // 1) Build query
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    // 2) Execute query
    const document = await query;

    if (!document) {
      res.status(404).json({success:false, message: 'you do not shopper by id'});
    }
    res.status(200).json({success:true ,data: document });
  });
  ///////////////////////////////////////////


// exports.getAll = (Model, modelName = '') =>
//   asyncHandler(async (req, res) => {
//     let filter = {};
//     if (req.filterObj) {
//       filter = req.filterObj;
//     }
//     // Build query
//     const documentsCounts = await Model.countDocuments();
//     const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
//       .paginate(documentsCounts)
//       .filter()
//       .search(modelName)
//       .limitFields()
//       .sort();

//     // Execute query
//     const { mongooseQuery, paginationResult } = apiFeatures;
//     const documents = await mongooseQuery;

//     res
//       .status(200)
//       .json({ results: documents.length, paginationResult, data: documents });
//   });

