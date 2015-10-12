/**
 * Created by gmazlami on 05.10.15.
 */

var async = require('async');

var Session = require('../../../server/api/session/session.model');
var RawSession = require('../../../server/api/session/raw_session.model');

var sessionForEachIncremental = function (gt_timestamp, cb) {

    var lastSession;
    var query = {};
    var counter = 0;

    if (gt_timestamp > null) {
        query = {"value.endTimestamp": {$gt: gt_timestamp}};
    }

    RawSession.count(query, function (err, count) {
        if (err) return cb(err);

        var totalSessions = count;

        var sessionStream = RawSession.find(query).sort({"_id": 1}).stream();
        sessionStream.on('data', function (rawSession) {

            if (counter % 10000 == 0) {
                console.log("session-Job: forEach: raw_sessions -> sessions (" + Math.floor((counter / totalSessions)*100) + "%)");
            }

            counter++;

            if (lastSession && lastSession["value"]["mac_address"] === rawSession["value"]["mac_address"] &&
                lastSession["value"]["endTimestamp"] + (1000 * 60 * 5) >= rawSession["value"]["startTimestamp"]) {

                lastSession["value"]["endTimestamp"] = rawSession["value"]["endTimestamp"];
                lastSession["value"]["count"] += rawSession["value"]["count"];

            } else {

                if (lastSession) {


                    var session = lastSession["value"];
                    session.duration = session.endTimestamp - session.startTimestamp;

                    Session.findOne({mac_address: session.mac_address, startTimestamp: session.startTimestamp}).exec(function (err, result) {
                        if (err) {
                            cb(err);
                        } else if (!result) {

                            // session doesn't exist yet.
                            var s = new Session();

                            s.count = session.count;
                            s.duration = session.duration;
                            s.startTimestamp = session.startTimestamp;
                            s.endTimestamp = session.endTimestamp;
                            s.locations = session.locations;
                            s.mac_address = session.mac_address;
                            s.weightedSignalStrength = session.weightedSignalStrength;
                            s.tags = session.tags;

                            s.save();

                        } else {

                            // session does exist, update.
                            s = result;
                            s.count = session.count;
                            s.duration = session.duration;
                            s.startTimestamp = session.startTimestamp;
                            s.endTimestamp = session.endTimestamp;
                            s.locations = session.locations;
                            s.mac_address = session.mac_address;
                            s.weightedSignalStrength = session.weightedSignalStrength;
                            s.tags = session.tags;

                            s.save();

                        }
                    });


                }

                lastSession = rawSession;

            }

        }).on('error', function (err) {
            if (err) return cb(err);
        }).on('close', function () {
            cb();
        });

    });

}


exports.incremental = sessionForEachIncremental;