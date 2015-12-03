/**
 * Created by seebi on 12.10.15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
  mac_address: { type: String, index: true },
  time: { type: Date, index: true},
  location: mongoose.Schema.Types.Mixed,
  area: { type: Number, index: true },
  noOfCircles: { type: Number, index: true},
  multiplier: Number,
  derivedFrom:  [{
    long: Number,
    lat: Number,
    weightedSignal: Number,
    cnt: Number
  } ],
  tags: {type: [String], index: true }
});

var Location = mongoose.model('locations',LocationSchema,'locations');

module.exports = Location;
