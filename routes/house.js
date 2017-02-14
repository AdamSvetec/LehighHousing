var express = require('express');
var router = express.Router();
var winston = require('winston');

/* GET home page. */
router.get('/house', function(req, res, next) {
	global.db.query('SELECT address,rent,bedroom_cnt,bathroom_cnt,parking_spot_cnt,AVG(room_size_rating) AS room_size_rating,AVG(cleanliness_rating) AS cleanliness_rating,AVG(overall_rating) AS overall_rating,name,phone_num,email,website,AVG(leniency_rating) AS leniency_rating,AVG(fairness_rating) AS fairness_rating,AVG(repair_rating) AS repair_rating \
    	FROM house, availability, review_house, review_landlord, landlord \
    	WHERE house.id=availability.house_id AND house.id=review_house.house_id AND house.landlord_id=review_landlord.landlord_id AND house.landlord_id=landlord.id \
      	AND house.id=? AND year=? \
      	GROUP BY house.id; \
      	SELECT name FROM house_attribute WHERE house_id=?; \
      	SELECT available, year, rent FROM availability WHERE house_id=? ORDER BY year DESC;',
    	[req.query.id, req.query.year,req.query.id,req.query.id],
    	function(err,query_ret){
        	if(err) winston.log('error',err);
        	if(query_ret.length != 3){
        		winston.log('error', 'incorrect number of rows returned by query');
        		next(err);
        	}else{
        		page_args = query_ret[0][0];
        		page_args.attributes = query_ret[1];
        		page_args.prices = query_ret[2];
      			res.render('house', page_args);
      		}
    	}
  	);
});

module.exports = router;