'use strict';

var _ = require('lodash');
var Session = require('../session/session.model')

// Get list of utilizations
exports.reduce = function (req, res) {

  var mapReduceOptions = {};

  var startTimestamp = new Date(parseInt(req.query.startTimestamp));
  var endTimestamp = new Date(parseInt(req.query.endTimestamp));
  var tags = req.query.tags ? req.query.tags.split(",") : [];

  // do not allow queries to range longer than a week.
  if (endTimestamp.getTime() - startTimestamp.getTime() > (1000 * 60 * 60 * 24 * 7)) {
    endTimestamp = new Date(startTimestamp.getTime() + (1000 * 60 * 60 * 24 * 7));
  }

  var slotSize = 5 * 60 * 1000 // 5 minute slot-time
  var mac_address = req.query.mac_address;

  mapReduceOptions.scope = {
    startTimestamp: startTimestamp,
    endTimestamp: endTimestamp,
    slotSize: slotSize
  };

  mapReduceOptions.map = function () {
    var lastTimestamp = startTimestamp;

    while (lastTimestamp < endTimestamp) {
      if (this.startTimestamp < lastTimestamp && this.endTimestamp > lastTimestamp) {
        emit(lastTimestamp, 1);
      }
      lastTimestamp = new Date(lastTimestamp.getTime() + slotSize);
    }
  }

  mapReduceOptions.reduce = function (key, values) {
    return Array.sum(values);
  }

  mapReduceOptions.query = {startTimestamp: {$lt: endTimestamp}, endTimestamp: {$gt: startTimestamp}};

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
