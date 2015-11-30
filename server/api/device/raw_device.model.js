var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var rawDeviceSchema = new Schema({
  value : {
    mac_address: String,
    vendor: String,
    last_seen: Date,
    tags: [{type: String}]
  }
});

var RawDevice = mongoose.model('raw_devices',rawDeviceSchema,'raw_devices');

module.exports = RawDevice;
