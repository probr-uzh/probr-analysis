'use strict';

var _ = require('lodash');
var Session = require('../session/session.model')

// Get list of utilizations
exports.reduce = function (req, res) {

  var mapReduceOptions = {};

  var startTime = parseInt(req.query.start);
  var endTime = parseInt(req.query.end);

  // do not allow queries to range longer than a week.
  if (endTime - startTime > (1000 * 60 * 60 * 24 * 7)) {
    endTime = startTime + (1000 * 60 * 60 * 24 * 7);
  }

  var slotSize = 5 * 60 * 1000 // 5 minute slot-time

  var mac_address = req.query.mac_address;
  var tags = req.query.tags ? req.query.tags.split(",") : [];

  mapReduceOptions.scope = {startTime: new Date(startTime), endTime: new Date(endTime), slotSize: slotSize};
  mapReduceOptions.map = function () {

    var tmpTime = new Date(startTime);

    while (tmpTime < endTime) {
      if (this.startTimestamp < tmpTime && this.endTimestamp > tmpTime) {
        emit(tmpTime, 1);
      }
      tmpTime = new Date(tmpTime.getTime() + slotSize);
    }

  }

  mapReduceOptions.reduce = function (key, values) {
    return Array.sum(values);
  }

  mapReduceOptions.query = {startTimestamp: { $lt: new Date(endTime)}, endTimestamp: { $gt: new Date(startTime)}};

  if (tags.length > 0) {
    mapReduceOptions.query.tags = {$in: tags}
  }

  if (mac_address !== undefined) {
    mapReduceOptions.query.mac_address = mac_address;
  }

  mapReduceOptions.sort = {id: 1}

  Session.mapReduce(
    mapReduceOptions,
    function (err, results, stats) {
      if (err) handleError(res, err);
      return res.status(200).json(results);
    }
  );

};

function handleError(res, err) {
  return res.status(500).send(err);
}
