'use strict';

var _ = require('lodash');
var Packet = require('../packet/packet.model')

// Get list of utilizations
exports.concurreny_count = function (req, res) {
  var mapReduceOptions = {};

  var cutOffDate = new Date();
  cutOffDate.setDate(cutOffDate.getDate() - 7);

  mapReduceOptions.map = function () {
    emit(Math.floor(this.time.getTime() / (1000 * 60 * 60 )), 1);
  }
  mapReduceOptions.reduce = function (key, values) {
    return Array.sum(values);
  }


  mapReduceOptions.query = {
    mac_address_src: req.query["mac_address_src"],time : {$gt : cutOffDate}
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
