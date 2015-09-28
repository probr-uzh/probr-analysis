'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var SessionSchema = new Schema({
    mac_address: String,
    endTimestamp: Date,
    startTimestamp: Date,
    count: Number,
    duration: Number,
});

module.exports = mongoose.model('Session', SessionSchema);
