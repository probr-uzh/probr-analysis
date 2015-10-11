'use strict';

var _ = require('lodash');
var Session = require('../session/session.model')

// Get list of utilizations
exports.concurreny_count_week = function (req, res) {
  var daysFactor = 7;
  var mapReduceOptions = {};

  mapReduceOptions.map = function () {
    var daysFactor = 7;
    emit(Math.floor(this.startTimestamp.getTime() / (1000 * 60 * 15 * daysFactor)), 1);
  }
  mapReduceOptions.reduce = function (key, values) {
    return Array.sum(values);
  }
  mapReduceOptions.query = {startTimestamp: {$gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * daysFactor)}};
  mapReduceOptions.sort = {id:1}

  Session.mapReduce(
    mapReduceOptions,
    function (err, results, stats) {
      if (err) handleError(res, err);
      return res.status(200).json(results);
    }
  );
};

exports.concurreny_count_day = function (req, res) {
  var daysFactor = 1;
  var mapReduceOptions = {};
  mapReduceOptions.map = function () {
    var daysFactor = 1;
    emit(Math.floor(this.startTimestamp.getTime() / (1000 * 60 * 15 * daysFactor)), 1);
  }
  mapReduceOptions.reduce = function (key, values) {
    return Array.sum(values);
  }
  mapReduceOptions.query = {startTimestamp: {$gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * daysFactor)}};
  mapReduceOptions.sort = {id:1}

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
