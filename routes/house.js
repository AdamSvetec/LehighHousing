var express = require('express');
var router = express.Router();
var winston = require('winston');
var nodemailer = require('nodemailer');
var transporter = require('../config').transporter;
var Landlord = require('../models/landlord');
var House = require('../models/house');

/* GET home page. */
router.get('/house/:house_id', function(req, res, next) {
	House.findOne({ '_id': req.params.house_id }, function(err, house){
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
      res.render('house', { 'house': house, 'landlord': landlord, 'year': req.query.year });
    });
  });
});

//Get page to review house
router.get('/house/:house_id/review', function(req, res, next) {
  House.findOne({ '_id': req.params.house_id }, function(err, house){
    if(err) { 
      winston.log('error', err); 
      next(err); 
    }
    if(house === null){ 
      next(); 
    }
    res.render('review', { stars: [{title: 'Room Size', name: 'room_size'}, {title: 'Cleanliness', name: 'cleanliness'}, {title: 'Overall Rating', name: 'overall_rating'}], title: house.address });
  });
});

//Submit page for house review
router.post('/house/:house_id/review', function(req, res, next) {
  //Error and submission rules check
  //TODO
  var review  = { email: req.body.email, message: req.body.message, date: new Date(), year_rented: req.body.year, room_size_rating: req.body.room_size, cleanliness_rating: req.body.cleanliness, overall_rating: req.body.overall_rating, user_confirmed: 0, system_confirmed: 0};
  
  House.findOne({ '_id': req.params.house_id }, function(err, house){
    if(err) { 
      winston.log('error', err); 
      next(err); 
    }
    if(house === null){ 
      next(); 
    }
    house.reviews.push(review);
    house.save(function(err){
      if(err){
        winston.log('error',err);
        next(err);
      }
    });
    let mailOptions = {
      from: '"Lehigh U Housing" <lehighuhousing@gmail.com>', // sender address
      to: req.body.email, // list of receivers
      subject: 'Confirm Review of: '+house.address, // Subject line
      text: 'Please confirm your review below:\nhttp://'+req.headers.host+'/house/'+req.params.house_id+'/review/confirm?email='+req.body.email+'\nThanks,\nLehigh U Housing', // plain text body
      html: '<p>Please <a href="http://'+req.headers.host+'/house/'+req.params.house_id+'/review/confirm?email='+req.body.email+'">confirm</a> your review.<br>Thanks,<br>Lehigh U Housing</p>' // html body
    };

    //Only send email in production environment
    if(req.app.get('env') == 'production'){
      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          winston.log('error',err); 
          res.redirect('back'); //displaying error message?
          return;
        }
      });
    }else{
      winston.log('info','Message sent to %s', mailOptions.to);
    }
    next({message: "Please check your email to confirm your submission", status: 200});
  });
});

//Confirm review for house
router.get('/house/:house_id/review/confirm', function(req, res, next) {
  House.findOne({ '_id': req.params.house_id }, function(err, house){
    if(err) { 
      winston.log('error', err); 
      next(err); 
    }
    if(house === null){ 
      next(); 
    }
    house.reviews.find( review => review.email == req.query.email).user_confirmed = true;
    house.save(function(err){
      if(err){
        winston.log('error',err);
        next(err);
      }
    });
    next({message: "Thank you for confirming your review", status: 200});
  });
});

module.exports = router;