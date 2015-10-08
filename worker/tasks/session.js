/**
 * Session Task to identify Sessions from Raw-Data
 */

var async = require('async');

var Packet = require('./../../server/api/packet/packet.model.js');
var RawSession = require('./../../server/api/session/raw_session.model.js');
var Session = require('./../../server/api/session/session.model.js');

var SessionForEach = require('../components/session/session.foreach');
var SessionMapReduce = require('../components/session/session.mapreduce');

module.exports = function (job, done) {

    // Check if raw_session exists, and job has already run once.
    RawSession.find().sort("-value.endTimestamp").limit(1).exec(function (err, rawSessionDocs) {

        // raw_session have been generated, at least once.
        if (rawSessionDocs[0] !== undefined) {

            var rawSessionBreakTime = rawSessionDocs[0].value.endTimestamp;
            console.log("session-Job: found raw_sessions collection and rawSessionBreakTime for incremental MapReduce");

            Packet.mapReduce(SessionMapReduce.getIncrementalMapReduceConfig(rawSessionBreakTime), function (err, results) {

                if (err) {
                    console.log("session-Job: Error: " + err)
                    return done();
                }

                console.log("session-Job: incremental map reduce done.");
                console.log("session-Job: forEach: raw_sessions -> sessions");

                SessionForEach.incremental(0, function () {
                    console.log("session-Job: forEach: raw_sessions -> sessions -> done");
                    done();
                });

            });

        } else {

            console.log("session-Job: no raw_sessions found. full map-reduce run to create it.");

            Packet.mapReduce(SessionMapReduce.mapReduceConfig, function (err, results) {

                if (err) {
                    console.log("session-Job: Error: " + err)
                    return done();
                }

                console.log("session-Job: full map reduce done.");
                console.log("session-Job: forEach: raw_sessions -> sessions");

                // forEach which iterates over all raw_devices and flattens their structure and adds the vendor, and puts that into the final devices collection
                SessionForEach.incremental(0, function () {
                    console.log("session-Job: forEach: raw_sessions -> sessions -> done");
                    done();
                });

            });

        }

    });

}