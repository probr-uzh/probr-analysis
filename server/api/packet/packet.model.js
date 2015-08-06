'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var PacketSchema = new Schema({
    capture_uuid: String,
    mac_address_src: String,
    mac_address_dst: String,
    inserted_at: Date,
    signal_strength: Number,
    ssid: String,
    tags: [{type: String}],
    vendor: String,
    loc: {type: [Number], index: '2dsphere'}
});

module.exports = mongoose.model('Packet', PacketSchema);