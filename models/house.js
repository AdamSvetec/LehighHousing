var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var houseReviewSchema = new Schema({
  email: {type: String, trim: true, required: true},
  message: {type: String, trim: true, required: true},
  date: { type: Date, default: Date.now },
  year_rented: { type: String, trim: true, match: [/^(19|20)\d{2}\-(19|20)\d{2}$/, "Year needs to be in xxxx-xxxx format"]},
  room_size_rating: Number,
  cleanliness_rating: Number,
  overall_rating: Number,
  user_confirmed: {type: Boolean, default: false},
  system_confirmed: {type: Boolean, default: false}
});

var houseSchema = new Schema({
  _id: Schema.Types.ObjectId,
  address: {type: String, trim: true},
  lat: Number,
  lng: Number,
  landlord_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Landlord'},
  bedroom_cnt: Number,
  bathroom_cnt: Number,
  parking_spot_cnt: Number,
  avg_room_size_rating: Number,
  avg_cleanliness_rating: Number,
  avg_overall_rating: Number,
  availability: [ {
    year: { type: String, trim: true, match: [/^(19|20)\d{2}\-(19|20)\d{2}$/, "Year needs to be in xxxx-xxxx format"]},
    available: Boolean,
    rent: Number 
  } ],
  reviews: [ houseReviewSchema ],
  attributes: [ { name: String } ]
});


/* Update rating averages */
houseSchema.pre('save', function (next) {
  var room_size_total=0, cleanliness_total=0, overall_total=0; 
  this.reviews.forEach(function (review) { 
    room_size_total+=review.room_size_rating; 
    cleanliness_total+=review.cleanliness_rating; 
    overall_total+=review.overall_rating; 
  });
  this.avg_room_size_rating = this.reviews.length > 0 ? room_size_total / this.reviews.length : 0;
  this.avg_cleanliness_rating = this.reviews.length > 0 ? cleanliness_total / this.reviews.length : 0;
  this.avg_overall_rating = this.reviews.length > 0 ? overall_total / this.reviews.length : 0;
  next();
});

var house = mongoose.model('House', houseSchema, 'house');

module.exports = house;