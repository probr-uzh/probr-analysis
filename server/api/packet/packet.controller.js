'use strict';

var _ = require('lodash');
var Packet = require('../packet/packet.model')

// Get list of utilizations
exports.concurreny_count = function (req, res) {

  var mapReduceOptions = {};

  var cutOffDate = new Date();
  cutOffDate.setDate(cutOffDate.getDate() - 7);

  mapReduceOptions.map = function () {

    var begin = new Date(parseInt(scope.start));
    var end = new Date(parseInt(scope.end));

    var sessionTime =

    emit(Math.floor(this.time.getTime() / (1000 * 60 * 60 )), 1);
  }

  mapReduceOptions.reduce = function (key, values) {
    return Array.sum(values);
  }

  mapReduceOptions.query = {
    mac_address_src: req.query["mac_address_src"], time: {$gt: cutOffDate}
  };

  mapReduceOptions.scope = {start: parseInt(req.query.startTime), end: parseInt(req.query.endTime)};

  Packet.mapReduce(
    mapReduceOptions,
    function (err, results, stats) {
      if (err) handleError(res, err);
      return res.status(200).json(results);
    }
  );
};


exports.punchcard_data = function (req, res) {
  var mapReduceOptions = {};

  var cutOffDate = new Date();
  cutOffDate.setMilliseconds(0);
  cutOffDate.setSeconds(0);
  cutOffDate.setMinutes(0);
  cutOffDate.setHours(0);
  cutOffDate.setDate(cutOffDate.getDate() - 7);

  console.log(cutOffDate);

  mapReduceOptions.map = function () {
    var date = new Date(this.time.getTime());
    var key = date.getDay() + "_" + date.getHours();
    emit(key, 1);
  }
  mapReduceOptions.reduce = function (key, values) {
    return Array.sum(values);
  }


  mapReduceOptions.query = {
    mac_address_src: req.query["mac_address_src"], time: {$gt: cutOffDate}
  };


  Packet.mapReduce(
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
