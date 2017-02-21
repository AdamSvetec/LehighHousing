var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var houseSchema = new Schema({
  _id: Schema.Types.ObjectId,
  address: String,
  lat: Number,
  lng: Number,
  landlord_id: Schema.Types.ObjectId,
  bedroom_cnt: Number,
  bathroom_cnt: Number,
  parking_spot_cnt: Number,
  availability: [ {
    year: String,
    available: Boolean,
    rent: Number 
  } ],
  reviews: [ {
    _id: Schema.Types.ObjectId,
    email: String,
    message: String,
    date: Date,
    year_rented: String,
    room_size_rating: Number,
    cleanliness_rating: Number,
    overall_rating: Number,
    user_confirmed: Boolean,
    system_confirmed: Boolean
  } ],
  attributes: [ { name: String } ]
});

var house = mongoose.model('house', houseSchema);

module.exports = house;