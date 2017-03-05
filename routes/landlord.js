var express = require('express');
var router = express.Router();
var winston = require('winston');
var Landlord = require('../models/landlord');
var House = require('../models/house');

/* GET home page. */
router.get('/landlord/:landlord_id', function(req, res, next) { 
  Landlord.findOne({ '_id': req.params.landlord_id }, function(err, landlord){
    if(err){
      winston.log('error',err);
      next(err);
    }
    if(landlord === null){
      next();
    }
    House.find({ 'landlord_id': req.params.landlord_id }, function(err, owned_houses){
      if(err){
        winston.log('error',err);
        next(err);
      }
      page_args = {};
      page_args.landlord = landlord;
      page_args.houses = owned_houses;
      res.render('landlord', page_args);
    });
  });
});

module.exports = router;