'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var TargetSchema = new Schema({
    mac_address: {type: String, index: true},
    alias: String,
});

module.exports = mongoose.model('Target', TargetSchema);
