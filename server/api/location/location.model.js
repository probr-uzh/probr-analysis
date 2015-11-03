/**
 * Created by seebi on 12.10.15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GeoJSONPoint = {'type': {type: String, default: "Point"}, coordinates: [{type: "Number"}]};

var LocationSchema = new Schema({
  mac_address: { type: String, index: true },
  time: Date,
  location: GeoJSONPoint,
  area: Number,
  noOfCircles: Number,
  multiplier: Number,
  derivedFrom:  [{
    long: Number,
    lat: Number,
    weightedSignal: Number,
    cnt: Number
  } ]
});

var Location = mongoose.model('locations',LocationSchema,'locations');

module.exports = Location;
