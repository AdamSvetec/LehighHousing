var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Lehigh Housing' });
});

router.get('/filter', function(req, res, next) {
 	global.db.query('SELECT id, lat, lng, address \
    	FROM house, availability \
    	WHERE id=house_id AND bedroom_cnt=? AND bathroom_cnt=? AND rent<=? AND rent>=? AND year=? AND available=1;',
    	[req.query.bedroom_cnt, req.query.bathroom_cnt, req.query.rent_high, req.query.rent_low, req.query.year],
    	function(err,rows){
        	if(err) console.log(err);
      	console.log(rows);
      	res.json(rows);
    	}
  	);
});

module.exports = router;
