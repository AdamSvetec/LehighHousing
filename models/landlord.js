var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var landlordSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  phone_num: String,
  email: String,
  website: String,
  reviews: [ {
  	email: String,
  	message: String,
  	date: Date,
  	year_rented: String,
  	leniency_rating: Number,
  	fairness_rating: Number,
  	repair_rating: Number,
  	user_confirmed: Boolean,
  	system_confirmed: Boolean
  } ]
});

var landlord = mongoose.model('Landlord', landlordSchema, 'landlord');

module.exports = landlord;
