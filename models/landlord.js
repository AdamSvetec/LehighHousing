var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var landlordReviewSchema = new Schema({
  email: {type: String, trim: true, required: true, unique: true},
  message: {type: String, trim: true, required: true},
  date: { type: Date, default: Date.now },
  year_rented: { type: String, trim: true, match: [/^(19|20)\d{2}\-(19|20)\d{2}$/, "Year needs to be in xxxx-xxxx format"]},
  leniency_rating: Number,
  fairness_rating: Number,
  repair_rating: Number,
  user_confirmed: {type: Boolean, default: false},
  system_confirmed: {type: Boolean, default: false}
});

var landlordSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  phone_num: String,
  email: String,
  website: String,
  avg_leniency_rating: Number,
  avg_fairness_rating: Number,
  avg_repair_rating: Number,
  reviews: [ landlordReviewSchema ]
});

/* Update rating averages */
landlordSchema.pre('save', function (next) {
  var leniency_total=0, fairness_total=0, repair_total=0, validated_review_count=0; 
  this.reviews.forEach(function (review) { 
    if(review.system_confirmed){
      leniency_total+=review.leniency_rating; 
      fairness_total+=review.fairness_rating; 
      repair_total+=review.repair_rating; 
      validated_review_count++;
    }
  });
  this.avg_leniency_rating = validated_review_count > 0 ? leniency_total / validated_review_count : 0;
  this.avg_fairness_rating = validated_review_count > 0 ? fairness_total / validated_review_count : 0;
  this.avg_repair_rating = validated_review_count > 0 ? repair_total / validated_review_count : 0;
  next();
});

var landlord = mongoose.model('Landlord', landlordSchema, 'landlord');

module.exports = landlord;
