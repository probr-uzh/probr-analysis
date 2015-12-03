/**
 * Created by seebi on 12.10.15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RawLocationSchema = new Schema({
    value: {
        numberOfLocations: Number,
        mac_address: String,
        time: {type: Date, index: true},
        locations: [ {
            long: Number,
            lat: Number,
            weightedSignal: Number,
            cnt: Number
        } ],
        tags: {type: [String]}
    }});

var RawLocation = mongoose.model('raw_locations',RawLocationSchema,'raw_locations');

module.exports = RawLocation;
