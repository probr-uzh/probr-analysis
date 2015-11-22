'use strict';

var _ = require('lodash');
var Session = require('../session/session.model')

// Get list of utilizations
exports.histogram = function (req, res) {

  var pipeline = [
    {
      "$match": {"duration": {$gte: 1000 * 60 * 2}}
    },
    {
      "$group": {
        "_id": "$mac_address",
        "count": {"$sum": 1}
      }
    },
    {
      "$group": {
        "_id": "$count",
        "count": {"$sum": 1}
      }
    },
    {
      "$sort": {"_id": 1}
    }
  ];

  Session.aggregate(pipeline).exec(function (err, result) {
    if (err) handleError(res, err);
    return res.status(200).json(result);
  });

};

function handleError(res, err) {
  return res.status(500).send(err);
}
