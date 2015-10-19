'use strict';

var _ = require('lodash');
var Session = require('../session/session.model')

// Get list of utilizations
exports.reduce = function (req, res) {

  var mapReduceOptions = {};
  var days = req.query.days;
  var mac_address = req.query.mac_address;
  var tags = req.query.tags ? req.query.tags.split(",") : [];

  mapReduceOptions.scope = {days: days};
  mapReduceOptions.map = function () {

    var emitDate = new Date(this.startTimestamp);
    emitDate.setMinutes(0);
    emitDate.setSeconds(0);
    emitDate.setMilliseconds(0);

    emit(emitDate, 1);
  }

  mapReduceOptions.reduce = function (key, values) {
    return Array.sum(values);
  }

  var previousDate = new Date();
  previousDate.setDate(previousDate.getDate() - days);

  mapReduceOptions.query = {startTimestamp: {$gt: previousDate}};

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
