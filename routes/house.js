var express = require('express');
var router = express.Router();
var winston = require('winston');
var Landlord = require('../models/landlord');
var House = require('../models/house');

/* GET home page. */
router.get('/house', function(req, res, next) {
	House.findOne({ '_id': req.query.id }, function(err, house){
    if(err){
      winston.log('error',err);
      next(err);
    }
    if(house === null){
      next();
    }
    Landlord.findOne({ '_id': house.landlord_id }, function(err, landlord){
      if(err){
        winston.log('error',err);
        next(err);
      }
      page_args = {};
      page_args.house = house;
      page_args.landlord = landlord;
      page_args.year = req.query.year;
      res.render('house', page_args);
    });
  });
});

module.exports = router;