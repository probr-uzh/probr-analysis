'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var SessionSchema = new Schema({
    mac_address: { type: String, index: true },
    endTimestamp: { type: Date, index: true },
    startTimestamp: { type: Date, index: true },
    count: Number,
    duration: Number,
});

module.exports = mongoose.model('Session', SessionSchema);
