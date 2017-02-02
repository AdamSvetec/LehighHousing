var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Lehigh Housing' });
});

router.get('/filter', function(req, res, next) {
  var house_rating = 'AVG(overall_rating) AS house_rating'
  var landlord_rating = 'AVG((leniency_rating+fairness_rating+repair_rating)/3) AS landlord_rating'
 	global.db.query('SELECT house.id AS id,lat,lng,address,rent,'+house_rating+','+landlord_rating+' \
    	FROM house, availability, review_house, review_landlord \
    	WHERE house.id=availability.house_id AND house.id=review_house.house_id AND house.landlord_id=review_landlord.landlord_id \
      AND bedroom_cnt=? AND bathroom_cnt=? AND rent<=? AND rent>=? AND year=? AND available=1 \
      GROUP BY house.id;',
    	[req.query.bedroom_cnt, req.query.bathroom_cnt, req.query.rent_high, req.query.rent_low, req.query.year],
    	function(err,rows){
        	if(err) console.log(err);
      	console.log(rows);
      	res.json(rows);
    	}
  	);
});

module.exports = router;
