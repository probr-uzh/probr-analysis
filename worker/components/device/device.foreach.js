/**
 * Created by gmazlami on 05.10.15.
 */

var async = require('async');

var RawDevice = require('../../../server/api/device/raw_device.model.js');
var Vendors = require('../../../server/config/vendor_db');
var Device = require('../../../server/api/device/device.model.js');

/*
 The forEach job that flattens the raw_devices structure and looks up the vendors, and then puts it into the
 devices collection. This function checks if the corresponding device entry already exists before updating.
 */
var executeDeviceForEach = function (gt_timestamp, cb) {

    var query = {};
    var counter = 0;

    if (gt_timestamp > null) {
        query = {"value.last_seen": {$gt: gt_timestamp}};
    }

    RawDevice.count(query, function (err, count) {
        if (err) return cb(err);

        var totalDevices = count;
        var deviceStream = RawDevice.find(query).stream();

        deviceStream.on('data', function (item) {

            if (counter % 500 == 0) {
                console.log("device-Job: forEach: raw_devices -> devices (" + Math.floor((counter / totalDevices) * 100) + "%)");
            }

            counter++;

            Device.findOne({mac_address: item.value.mac_address}).exec(function (err, result) {
                if (err) {
                    cb(err);
                } else if (!result) {

                    // there are no devices with the given mac address
                    var d = new Device();
                    d.mac_address = item.value.mac_address;
                    d.vendor = Vendors.vendors[item.value.mac_address.substr(0, 6)];
                    d.last_seen = item.value.last_seen;
                    d.save();

                } else {

                    // The device already exists in the collection --> only update the last_seen timestamp
                    if (result.last_seen < item.value.last_seen) {
                        result.last_seen = item.value.last_seen;
                        result.save();
                    }

                }

            });
        }).on('error', function (err) {
            if (err) return cb(err);
        }).on('close', function () {
            cb();
        });

    });

}

exports.incremental = executeDeviceForEach;