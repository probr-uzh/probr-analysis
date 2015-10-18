'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var SessionSchema = new Schema({
    mac_address: {type: String, index: true},
    endTimestamp: {type: Date, index: true},
    startTimestamp: {type: Date, index: true},
    count: Number,
    locations: {},
    tags: [{type: String}],
    weightedSignalStrength: Number,
    duration: Number
});

module.exports = mongoose.model('sessions', SessionSchema, 'sessions');
