'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GeoJSONPoint = {'type': {type: String, default: "Point"}, coordinates: [{type: "Number"}]};
var UtilizationSchema = new Schema({
    _id: Date,
    value: {
        mac_address_src: String,
        totalSignalStrength: Number,
        location: GeoJSONPoint,
    }
});

module.exports = mongoose.model('Utilization', UtilizationSchema);