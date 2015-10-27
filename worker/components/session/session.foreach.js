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

    var sessionStream = RawSession.find(query).sort({"_id.mac_address": 1, "_id.startTimestamp": 1}).stream();

    sessionStream.on('data', function (currentSession) {

      if (counter % 1000 == 0) {
        console.log("session-Job: forEach: raw_sessions -> sessions (" + Math.floor((counter / totalSessions) * 100) + "%)");
      }

      counter++;

      if (lastSession !== undefined
        && lastSession.value.mac_address === currentSession.value.mac_address
        && new Date(lastSession.value.endTimestamp.getTime() + (1000 * 60 * 5)) >= currentSession.value.startTimestamp) {

        console.log("session gets extended");

        lastSession["value"]["endTimestamp"] = currentSession["value"]["endTimestamp"];
        lastSession["value"]["count"] += currentSession["value"]["count"];

      } else if (lastSession !== undefined) {

        var session = lastSession["value"];
        session.duration = session.endTimestamp - session.startTimestamp;

        Session.findOneAndUpdate({mac_address: session.mac_address, startTimestamp: session.startTimestamp}, session, {upsert: true}, function (err, result) {
          if (err) {
            cb(err);
          }
        });

        lastSession = currentSession;

      } else {
        lastSession = currentSession;
      }

    }).on('error', function (err) {
      if (err) return cb(err);
    }).on('close', function () {
      cb();
    });

  });

}


exports.incremental = sessionForEachIncremental;
