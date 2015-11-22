'use strict';

var _ = require('lodash');
var Session = require('../session/session.model')

// Get list of utilizations
exports.histogram = function (req, res) {

  var startTimestamp = new Date(parseInt(req.query.startTimestamp));
  var endTimestamp = new Date(parseInt(req.query.endTimestamp));
  var tags = req.query.tags ? req.query.tags.split(",") : [];
  var query = {startTimestamp: {$lt: endTimestamp}, endTimestamp: {$gt: startTimestamp}};

  if (tags.length > 0) {
    query.tags = {$in: tags}
  }

  var pipeline = [
    {
      "$match": query
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
