'use strict';

var _ = require('lodash');
var Session = require('../session/session.model')

// Get list of utilizations
exports.concurreny_count = function (req, res) {
  var daysFactor = req.query.daysFactor ? req.query.daysFactor : 7;
  var tags = req.query.tags ? req.query.tags.split(",") : [];
  var mapReduceOptions = {};

  mapReduceOptions.map = function () {
    emit(Math.floor(this.startTimestamp.getTime() / (1000 * 60 * 20 * daysFactor)), 1);
  };

  mapReduceOptions.reduce = function (key, values) {
    return Array.sum(values);
  };

  mapReduceOptions.query = {
    startTimestamp: {$gt: new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * daysFactor))},

  };

  if(tags.length>0){
    mapReduceOptions.query.tags = {$in: tags}
  }

  mapReduceOptions.sort = {id: 1};
  mapReduceOptions.scope = {
    daysFactor: daysFactor
  };

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
