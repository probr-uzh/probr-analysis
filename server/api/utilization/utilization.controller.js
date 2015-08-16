'use strict';

var _ = require('lodash');
var Packet = require('../packet/packet.model')

// Get list of utilizations
exports.punchcard = function (req, res) {

  var pipeline = [];

  if (req.query.mac_address_src) {
    pipeline.push({"$match": {"mac_address_src": req.query.mac_address_src}});
  }

  pipeline.push({
    "$group": {
      "_id": {"$dateToString": {"format": "%w-%H", "date": "$time"}},
      "count": {"$sum": 1}
    }
  });

  Packet.aggregate(pipeline).exec(function (err, result) {
    if (err) handleError(res, err);
    return res.status(200).json(result);
  });

};

// Get a single utilization
exports.max = function (req, res) {

  Packet.aggregate({
    "$group": {
      "_id": {"$dateToString": {"format": "%Y-%m-%d-%H", "date": "$time"}},
      "count": {"$sum": 1}
    }
  }).sort({"count": -1}).exec(function (err, result) {
    if (err) handleError(res, err);
    return res.status(200).json(result);
  });

};

function handleError(res, err) {
  return res.status(500).send(err);
}
