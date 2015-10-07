/**
 * Created by gmazlami on 05.10.15.
 */
var RawDevice = require('../../api/device/raw_device.model.js');
var Vendors = require('../../config/vendor_db');
var Device = require('../../api/device/device.model.js');


/*
 The forEach job that flattens the raw_devices structure and looks up the vendors, and then puts it into the
 devices collection. This function checks if the corresponding device entry already exists before updating.
 */
var executeDeviceForEach = function(gt_timestamp){
  RawDevice.find({"value.last_seen" : {$gt: gt_timestamp}}).exec(function(err,docs){
    docs.forEach(function(element, index, array){
      Device.findOne({mac_address: element.value.mac_address}).exec(function(err,result){
        if(err){
          console.log("CRON: Error during forEach from raw_devices -> devices.");
        }
        else if(!result){ //there are no devices with the given mac address
          var d = new Device();
          d.mac_address = element.value.mac_address;
          d.vendor = Vendors.vendors[element.value.mac_address.substr(0,6)];
          d.last_seen = element.value.last_seen;
          d.save();
        }else{ //The device already exists in the collection --> only update the last_seen timestamp
          if(result.last_seen < element.value.last_seen){
            result.last_seen = element.value.last_seen;
            result.save();
          }
        }
      });
    });
  });
}


exports.incremental = executeDeviceForEach;


/*
 The forEach job that flattens the raw_devices structure and looks up the vendors, and then puts it into the
 devices collection. This function doesn't check if the corresponding device entry already exists before updating, so only use it on the first run of the cron.
 */
var initialDeviceForEach = function(){
  RawDevice.find().exec(function(err,docs){
    docs.forEach(function(element, index, array){
      var d = new Device();
      d.mac_address = element.value.mac_address;
      d.vendor = Vendors.vendors[element.value.mac_address.substr(0,6)];
      d.last_seen = element.value.last_seen;
      d.save();
    });
  });
}


exports.full = initialDeviceForEach;
