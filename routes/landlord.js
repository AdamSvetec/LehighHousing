var express = require('express');
var router = express.Router();
var winston = require('winston');

/* GET home page. */
router.get('/landlord', function(req, res, next) {
	console.log("in routing");
  global.db.query('SELECT name, phone_num, email, website, AVG(leniency_rating) AS leniency_rating, AVG(fairness_rating) AS fairness_rating, AVG(repair_rating) AS repair_rating \
    	FROM landlord, review_landlord \
    	WHERE landlord.id=review_landlord.landlord_id \
      AND landlord.id=? \
      GROUP BY landlord.id; \
      SELECT address, bedroom_cnt, bathroom_cnt, parking_spot_cnt, AVG(room_size_rating) AS room_size_rating, AVG(cleanliness_rating) AS cleanliness_rating, AVG(overall_rating) AS overall_rating \
      FROM house, review_house \
      WHERE house.id=review_house.house_id AND house.landlord_id=? \
      GROUP BY house.id;',
    	[req.query.id, req.query.id],
    	function(err,query_ret){
        	if(err) winston.log('error',err);
        	if(query_ret.length != 2){
        		winston.log('error', 'incorrect number of rows returned by query');
        		next(err);
        	}else{
        		page_args = query_ret[0][0];
            page_args.houses = query_ret[1];
      			res.render('landlord', page_args);
      		}
    	}
  	);
});

module.exports = router;