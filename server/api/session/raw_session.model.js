/**
 * Created by gmazlami on 05.10.15.
 */

'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var RawSessionSchema = new Schema({
    value: {
        sessions: [{
            mac_address: {type: String, index: true},
            endTimestamp: {type: Date, index: true},
            startTimestamp: {type: Date, index: true},
            count: Number,
            weightedSignalStrength: Number,
            tags: [{type: String}]
        }],
        noOfSessions: Number
    }
});

// Index needed for the session forEach job, which sorts on both fields.
// Without index, sort can't use the individual indexes and 32MB limit is hit
RawSessionSchema.index({"_id.mac_address": 1, "_id.startTimestamp": 1});

module.exports = mongoose.model('raw_sessions', RawSessionSchema, 'raw_sessions');
