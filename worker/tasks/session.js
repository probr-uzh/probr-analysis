/**
 * Session Task
 *
 * Merges any packets from one device, that are within 5min
 * of each other to sessions together.
 *
 */

var Packet = require('./../../server/api/packet/packet.model.js');
var RawSession = require('./../../server/api/session/raw_session.model.js');
var Session = require('./../../server/api/session/session.model.js');
var Log = require('../model/log.model');

var SessionMapReduce = require('../components/session/session.mapreduce');

module.exports = function (job, done) {

    // Find time from which to start incremental map/reduce
    // by looking at the last successful run of the session job
    Log.find({
        job: 'session',
        type: 'finished',
        "data.until": {$exists: true}
    }).sort('-time').limit(1).exec(function(err, resultsLastLog) {
        if (err) {
            throw('logs.find() error: ' + err);
        }

        // Start at the time of the latest packet processed by the previous job (if exists)
        var lastLog = resultsLastLog[0];
        if (lastLog && lastLog.data && lastLog.data.until) {
            var startTime = resultsLastLog[0].data.until;
            var opts = { query: { inserted_at: { $gte: startTime } } }
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

            // Start map/reduce
            var mrConfig = SessionMapReduce.mapReduceConfig(opts);
            Packet.mapReduce(mrConfig, function (err, resultsMapReduce) {
                if (err) {
                    throw('map/reduce error: ' + err);
                }

                // Unwind sessions_raw -> sessions
                RawSession.aggregate([
                    {$match: {"value.sessions.duration": {$gte: 60}}},
                    {$match: {mac_address: {$not: /.(2|3|6|7|a|b|e|f).{10}/i}}},
                    {$unwind: "$value.sessions"},
                    {$match: {"value.sessions.duration": {$gte: 60}}},
                    {$project: {
                        _id: 0,
                        mac_address: "$value.sessions.address",
                        startTimestamp: "$value.sessions.startTimestamp",
                        endTimestamp: "$value.sessions.endTimestamp",
                        count: "$value.sessions.count",
                        tags: "$value.sessions.tags",
                        weightedSignalStrength: "$value.sessions.weightedSignalStrength",
                        locations: {},
                        duration: "$value.sessions.duration"}
                    },
                    {$out: "sessions"}
                ], function(err, resultsAggregate) {
                    if (err) {
                        throw('aggregate error: ' + err);
                    }

                    var returnValue = { until: endTime }
                    if (startTime)
                        returnValue.from = startTime;

                    return done(returnValue);
                });


            });
        });
    });
};



