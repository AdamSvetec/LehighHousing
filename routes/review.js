var express = require('express');
var router = express.Router();
var winston = require('winston');
const nodemailer = require('nodemailer');
var transporter = require('../config').transporter;

let success_msg = "Thank you!";
let failure_msg = "Sorry we could not process your request";

//Get page to review landlord
//  -Expects id argument with id of landlord
router.get('/review/landlord', function(req, res, next) {
  global.db.query('SELECT name FROM landlord WHERE id=?;',
    [req.query.id],
    function(err,landlord){
      if(err) { 
        winston.log('error', err); 
        next(err); 
      }
      if(landlord.length < 1){ 
        winston.log('error','landlord not found');
        next({message: failure_msg, status: 200}); 
      }else{
        res.render('review', { stars: ['Leniency', 'Fairness', 'Repairs'], title: landlord[0].name, landlord_id: req.query.id });
      }
    }
    );
});

//Submit page for landlord review
router.post('/review/landlord', function(req, res, next) {
  //Error and submission rules check
  //TODO

  var review  = {landlord_id: req.query.id, user_email: req.body.email, message: req.body.message, date: new Date(), year_rented: req.body.year, leniency_rating: req.body.Leniency, fairness_rating: req.body.Fairness, repair_rating: req.body.Repairs, user_confirmed: 0, system_confirmed: 0};
  var review_id;
  global.db.query('INSERT IGNORE INTO user SET ?; \
    INSERT INTO review_landlord SET ?; \
    SELECT LAST_INSERT_ID() AS id;',
    [{email: req.body.email}, review],
    function(err,id){
      if(err) { 
        winston.log('error', err); 
        next(err); 
      }
      if(id.length < 3 || id[2].length < 1){ 
        winston.log('error', 'id of inserted review not returned'); 
        next(err); 
      }
      review_id = id[2][0].id;
      let mailOptions = {
        from: '"Lehigh U Housing" <lehighuhousing@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: 'Confirm '+req.body.title+' Review', // Subject line
        text: 'Please confirm your review below:\nhttp://'+req.headers.host+'/review/landlord/confirm?id='+review_id+'\nThanks,\nLehigh U Housing', // plain text body
        html: '<p>Please <a href="http://'+req.headers.host+'/review/landlord/confirm?id='+review_id+'">confirm</a> your review.<br>Thanks,<br>Lehigh U Housing</p>' // html body
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
      next({message: success_msg+" Please check your email to confirm your submission", status: 200});
    }
  );
});

//Have user confirm given review
router.get('/review/landlord/confirm', function(req, res, next) {
  global.db.query('UPDATE review_landlord SET user_confirmed=1 WHERE id=?;',
    [req.query.id],
    function(err,ret){
      if(err){
        winston.log('error', err); 
        next({message: failure_msg, status: 200});
      }else{
        next({message: success_msg, status: 200});
      }
    }
  );
});

//Get page to review house
//  -Expects id argument with id of house
router.get('/review/house', function(req, res, next) {
  global.db.query('SELECT address FROM house WHERE id=?;',
    [req.query.id],
    function(err,house){
      if(err){
        winston.log('error', err);
        next(err); 
      }
      if(house.length < 1){ 
        winston.log('error','house not found');
        next({message: failure_msg, status: 200}); 
      }else{
        res.render('review', { stars: ['Room Size', 'Cleanliness', 'Overall Rating'], title: house[0].address, house_id: req.query.id });
      }
    }
  );
});

//Submit page for house review
router.post('/review/house', function(req, res, next) {
  //Error and submission rules check
  //TODO

  console.log(req.body);

  var review  = {house_id: req.query.id, user_email: req.body.email, message: req.body.message, date: new Date(), year_rented: req.body.year, room_size_rating: req.body['Room Size'], cleanliness_rating: req.body.Cleanliness, overall_rating: req.body['Overall Rating'], user_confirmed: 0, system_confirmed: 0};
  var review_id;
  global.db.query('INSERT IGNORE INTO user SET ?; \
    INSERT INTO review_house SET ?; \
    SELECT LAST_INSERT_ID() AS id;',
    [{email: req.body.email}, review],
    function(err,id){
      if(err) { 
        winston.log('error', err); 
        next(err); 
      }
      if(id.length < 3 || id[2].length < 1){ 
        winston.log('error', 'id of inserted review not returned'); 
        next(err); 
      }
      review_id = id[2][0].id;
      let mailOptions = {
        from: '"Lehigh U Housing" <lehighuhousing@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: 'Confirm '+req.body.title+' Review', // Subject line
        text: 'Please confirm your review below:\nhttp://'+req.headers.host+'/review/house/confirm?id='+review_id+'\nThanks,\nLehigh U Housing', // plain text body
        html: '<p>Please <a href="http://'+req.headers.host+'/review/house/confirm?id='+review_id+'">confirm</a> your review.<br>Thanks,<br>Lehigh U Housing</p>' // html body
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
      next({message: success_msg+" Please check your email to confirm your submission", status: 200});
    }
  );
});

//Confirm review for house
router.get('/review/house/confirm', function(req, res, next) {
  global.db.query('UPDATE review_house SET user_confirmed=1 WHERE id=?;',
    [req.query.id],
    function(err,ret){
      if(err){
        winston.log('error', err); 
        next({message: failure_msg, status: 200});
      }else{
        next({message: success_msg, status: 200});
      }
    }
  );
});

module.exports = router;