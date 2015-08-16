'use strict';

var _ = require('lodash');
var Packet = require('../packet/packet.model')

// Get list of utilizations
exports.punchcard = function (req, res) {

  var pipeline = [];

  if (req.query) {
    var match = {"$match" : { "$and": []}};
    for (var param in req.query) {
      var obj = {};
      if (Array.isArray(req.query[param])) {
        obj[param] = { $in: req.query[param] };
      } else {
        obj[param] = req.query[param];
      }
      match["$match"]["$and"].push(obj);
    }
    if (match["$match"]["$and"].length > 0) {
      pipeline.push(match);
    }
  }

  if (req.query.mac_address_src) {
    pipeline.push({"$match": { "$and": [{"mac_address_src": req.query.mac_address_src}]}});
  }

  if (req.query.tags) {
    pipeline.push({"$match": {"tag": req.query.mac_address_src}});
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
