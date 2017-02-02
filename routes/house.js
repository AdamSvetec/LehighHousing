var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/house', function(req, res, next) {
  res.render('house', { title: 'House' });
});

module.exports = router;