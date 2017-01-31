var express = require('express');
var router = express.Router();

router.get('/test', function(req, res, next) {
  res.render('test', { title: 'Testing Page' });
});

router.get('/searching', function(req, res, next) {
	res.send("returned value");
});

module.exports = router;