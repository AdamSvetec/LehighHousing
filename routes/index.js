var express = require('express');
var router = express.Router();
var winston = require('winston');
var House = require('../models/house');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Lehigh Housing' });
});

/* Get houses that match query options */
router.get('/filter', function(req, res, next) {
  House.find({ 'bedroom_cnt': req.query.bedroom_cnt, 'availability': {$elemMatch: { 'year': req.query.year, 'rent': {$lte:req.query.rent_high, $gte:req.query.rent_low}, 'available': true }}}, function(err, houses){
    if(err){
      winston.log('error',err);
      next(err);
    }
    res.json(houses);
  });
});

module.exports = router;
