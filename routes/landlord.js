var express = require('express');
var router = express.Router();
var winston = require('winston');
var nodemailer = require('nodemailer');
var transporter = require('../config').transporter;
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
      res.render('landlord', { 'landlord': landlord, 'houses': owned_houses});
    });
  });
});

//Get page to review landlord
router.get('/landlord/:landlord_id/review', function(req, res, next) {
  Landlord.findOne({ '_id': req.params.landlord_id }, function(err, landlord){
    if(err) { 
      winston.log('error', err); 
      next(err); 
    }
    if(landlord === null){ 
      next(); 
    }
    res.render('review', { stars: [{title: 'Leniency', name: 'leniency'}, {title: 'Fairness', name: 'fairness'}, {title: 'Repairs', name: 'repairs'}], title: landlord.name });
  });
});

//Submit page for landlord review
router.post('/landlord/:landlord_id/review', function(req, res, next) {
  //Error and submission rules check
  //TODO
  var review  = { email: req.body.email, message: req.body.message, date: new Date(), year_rented: req.body.year, leniency_rating: req.body.leniency, fairness_rating: req.body.fairness, repair_rating: req.body.repairs, user_confirmed: 0, system_confirmed: 0};
  Landlord.findOne({ '_id': req.params.landlord_id }, function(err, landlord){
    if(err) { 
      winston.log('error', err); 
      next(err); 
    }
    if(landlord === null){ 
      next(); 
    }
    landlord.reviews.push(review);
    landlord.save(function(err){
      if(err){
        winston.log('error',err);
        next(err);
      }
    });
    let mailOptions = {
      from: '"Lehigh U Housing" <lehighuhousing@gmail.com>', // sender address
      to: req.body.email, // list of receivers
      subject: 'Confirm Review of: '+landlord.name, // Subject line
      text: 'Please confirm your review below:\nhttp://'+req.headers.host+'/landlord/'+req.params.landlord_id+'/review/confirm?email='+req.body.email+'\nThanks,\nLehigh U Housing', // plain text body
      html: '<p>Please <a href="http://'+req.headers.host+'/landlord/'+req.params.landlord_id+'/review/confirm?email='+req.body.email+'">confirm</a> your review.<br>Thanks,<br>Lehigh U Housing</p>' // html body
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

//Have user confirm given review
router.get('/landlord/:landlord_id/review/confirm', function(req, res, next) {
  Landlord.findOne({ '_id': req.params.landlord_id }, function(err, landlord){
    if(err) { 
      winston.log('error', err); 
      next(err); 
    }
    if(landlord === null){ 
      next(); 
    }
    landlord.reviews.find( review => review.email == req.query.email).user_confirmed = true;
    landlord.save(function(err){
      if(err){
        winston.log('error',err);
        next(err);
      }
    });
    next({message: "Thank you for confirming your review", status: 200});
  });
});

module.exports = router;