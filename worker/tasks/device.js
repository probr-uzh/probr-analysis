/**
 * Device Task to find Devices from Raw-Data
 */

var async = require('async');
var Packet = require('./../../server/api/packet/packet.model.js');
var Device = require('./../../server/api/device/device.model.js');
var Vendors = require('../../server/config/vendor_db');
var Log = require('../model/log.model');


module.exports = function (job, done) {
    Log.find({
        job: 'device',
        type: 'finished',
        "data.until": {$exists: true}
    }).sort('-time').limit(1).exec(function(err, resultsLastLog) {
        if (err) {
            throw('logs.find() error: ' + err);
        }

        // Get the time of the last packet we are about to process
        // This value will be saved in the log after a successful run and used by the
        // next job as a starting time.
        Packet.find().sort('-inserted_at').limit(1).exec(function(err, resultsLastPacket) {
            if (err) {
                throw('packets.find() error: ' + err);
            }

            // If there are no packets, graceful end job.
            if (resultsLastPacket.length > 0) {
                var endTime = resultsLastPacket[0].inserted_at;
            } else {
                return done('No packets found.')
            }

            var pipeline = [];

            // Start at the time of the latest packet processed by the previous job (if exists)
            var lastLog = resultsLastLog[0];
            if (lastLog && lastLog.data && lastLog.data.until) {
                var startTime = resultsLastLog[0].data.until;
                pipeline.push({$match: {'inserted_at': {$gte: startTime, $lte: endTime}}});
            }

            pipeline.push({$unwind: "$tags"});
            pipeline.push({
                $group: {
                    _id: "$mac_address_src",
                    "last_seen": {$max: "$time"},
                    "tags": {$addToSet: "$tags"}
                }
            });

            var cursor = Packet.aggregate(pipeline)
                .cursor({batchSize: 1000})
                .exec();

            cursor.each(function (err, d) {

                // At end of data
                if (!d) {
                    var returnValue = { until: endTime };
                    if (startTime)
                        returnValue.from = startTime;
                    return done(returnValue);
                }

                Device.findOneAndUpdate({_id: d._id},
                    {
                        mac_address: d._id,
                        vendor: Vendors.vendors[d._id.substr(0, 6)],
                        last_seen: d.last_seen,
                        $addToSet: {tags: {$each: d.tags}}
                    },
                    {upsert: true},
                    function (err, result) {
                        if (err) {
                            throw('upsert error: ' + err);
                        }
                    });

            });
        });
    });
};
