var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var deviceSchema = new Schema({
  mac_address: String,
  vendor: String,
  last_seen: Date
});

var Device = mongoose.model('Device',deviceSchema);

//var test = new Device({mac_address: '123456789', vendor: 'Google', last_seen: new Date()});
//
//test.save(function(err) {
//  if (err) throw err;
//
//  console.log('User saved successfully!');
//});

module.exports = Device;
