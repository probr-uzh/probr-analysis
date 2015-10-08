/**
 * Device Task to find Devices from Raw-Data
 */

var async = require('async');
var Packet = require('./../../server/api/packet/packet.model.js');
var RawDevice = require('./../../server/api/device/raw_device.model.js');
var Device = require('./../../server/api/device/device.model.js');

var DeviceForEach = require('../components/device/device.foreach');
var DeviceMapReduce = require('../components/device/device.mapreduce');

module.exports = function (job, done) {

    // Check if collection exists
    RawDevice.find().sort("-value.last_seen").limit(1).exec(function (err, doc) {

        // It does, so start job directly
        if (doc[0] !== undefined) {

            var breakTime = doc[0].value.last_seen;
            console.log("device-Job: found raw_device collection and breakTime for incremental MapReduce");

            //configure the map reduce job
            var mapReduceOptions = DeviceMapReduce.getIncrementalMapReduceConfig(breakTime);

            Packet.mapReduce(mapReduceOptions, function (err, results) {
                if (err) {
                    console.log("device-Job: Error: " + err)
                    done();
                } else {
                    console.log("device-Job: forEach: raw_devices -> devices");
                    DeviceForEach.incremental(breakTime, function () {
                        console.log("device-Job: forEach: raw_devices -> devices -> done");
                        done();
                    });
                }
            });

        } else {

            console.log("device-Job: no raw_device found. full map-reduce run to create it.");

            Packet.mapReduce(DeviceMapReduce.mapReduceConfig, function (err, results) {
                if (err) {
                    console.log("device-Job: Error: " + err)
                    done();
                } else {
                    console.log("device-Job: full map reduce done.");
                    console.log("device-Job: forEach: raw_devices -> devices");
                    // forEach which iterates over all raw_devices and flattens their structure and adds the vendor, and puts that into the final devices collection
                    DeviceForEach.incremental(0, function () {
                        console.log("device-Job: forEach: raw_devices -> devices -> done");
                        done();
                    });

                }
            });

        }

    });

}