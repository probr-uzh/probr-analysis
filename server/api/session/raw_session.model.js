/**
 * Created by gmazlami on 05.10.15.
 */

'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var RawSessionSchema = new Schema({
    value: {
        mac_address: { type: String, index: true },
        endTimestamp: { type: Date, index: true },
        startTimestamp: { type: Date, index: true },
        count: Number,
        weightedSignalStrength : Number,
        locations : {},
        tags: [{type: String}]
    }
});

module.exports = mongoose.model('raw_sessions', RawSessionSchema, 'raw_sessions');