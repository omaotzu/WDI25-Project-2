const mongoose = require('mongoose');


const placeSchema = new mongoose.Schema({
  name: {type: String, required: true},
  region: {type: String, required: true},
  licence: {type: String},
  rating: {type: Number, required: true},
  keywords: {type: String, required: true},
  price: {type: Number},
  address: {type: String, required: true},
  description: {type: String, required: true}
});

module.exports = mongoose.model('Place', placeSchema);
