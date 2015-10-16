/**
 * Created by seebi on 12.10.15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GeoJSONPoint = {'type': {type: String, default: "Point"}, coordinates: [{type: "Number"}]};

var LocationSchema = new Schema({
  mac_address: String,
  time: Date,
  location: GeoJSONPoint,
  area: Number,
  noOfCircles: Number,
  multiplier: Number
});

var Location = mongoose.model('locations',LocationSchema,'locations');

module.exports = Location;
