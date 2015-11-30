'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var PacketSchema = new Schema({
    capture_uuid: String,
    mac_address_src: { type: String, index: true },
    mac_address_dst: String,
    inserted_at: { type: Date, index: true },
    time: { type: Date, index: true },
    signal_strength: Number,
    ssid: { type: String, index: true },
    tags: [{type: String, index: true }],
    location: {type: [Number], index: '2dsphere'}
});

// PacketSchema.index({ "inserted_at": 1 }, { expire: '15d' });

module.exports = mongoose.model('Packet', PacketSchema);
