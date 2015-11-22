'use strict';

var _ = require('lodash');
var Packet = require('./packet.model')

// Get list of utilizations
exports.concurreny_count = function (req, res) {

  var mapReduceOptions = {};

  var cutOffDate = new Date();
  cutOffDate.setDate(cutOffDate.getDate() - 7);

  mapReduceOptions.map = function () {

    var begin = new Date(parseInt(scope.start));
    var end = new Date(parseInt(scope.end));

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

  var startDate = new Date(parseInt(req.query["start_date"]));


  mapReduceOptions.map = function () {
    var date = new Date(this.time.getTime());
    var key = date.getDay() + "_" + date.getHours();
    emit(key, 1);
  }
  mapReduceOptions.reduce = function (key, values) {
    return Array.sum(values);
  }


  mapReduceOptions.query = {
    mac_address_src: req.query["mac_address_src"], time: {$gt: startDate}
  };


  Packet.mapReduce(
    mapReduceOptions,
    function (err, results, stats) {
      if (err) handleError(res, err);
      return res.status(200).json(results);
    }
  );
};


exports.countquery = function(req,res){
  var globalQuery = JSON.parse(req.query.query);

  var query = {};

  var tags = globalQuery["tags"];

  //if there are tags, split the to an array and put into query
  if(tags !== undefined){
    tags = tags.split(",");

    if(tags.length < 2){
      tags = [tags];
    }

    query.tags = {$all: tags};
  }


  var startTimestamp = globalQuery["startTimestamp"];

  var endTimestamp = globalQuery["endTimestamp"];



  //if there are timestamps, put them into query
  if(startTimestamp !== undefined && endTimestamp !== undefined){
    var expression = [];

    startTimestamp = new Date(parseInt(startTimestamp));
    endTimestamp = new Date(parseInt(endTimestamp));

    expression.push({time : {$gt: startTimestamp}});
    expression.push({time : {$lt: endTimestamp}});
    query.$and = expression;
  }


  Packet.find(query).count().exec(function(err,results){
    if(err) handleError(res,err);
    return res.status(200).json({count: results});
  });
}

exports.query = function (req, res) {

  var query = {};

  var querySort = req.query["sort"];;
  var queryLimit = req.query["limit"];
  var querySkip = req.query["skip"];

  var tags = req.query.query["tags"];

  //if there are tags, split the to an array and put into query
  if(tags !== undefined){
    tags = tags.split(",");

    if(tags.length < 2){
      tags = [tags];
    }

    query.tags = {$all: tags};
  }

  var globalQuery = JSON.parse(req.query.query);

  var startTimestamp = globalQuery["startTimestamp"];

  var endTimestamp = globalQuery["endTimestamp"];



  //if there are timestamps, put them into query
  if(startTimestamp !== undefined && endTimestamp !== undefined){
    var expression = [];

    startTimestamp = new Date(parseInt(startTimestamp));
    endTimestamp = new Date(parseInt(endTimestamp));

    expression.push({time : {$gt: startTimestamp}});
    expression.push({time : {$lt: endTimestamp}});
    query.$and = expression;
  }

  Packet.find(query).sort(querySort).skip(querySkip).limit(queryLimit).exec(function(err,results){
    if(err) handleError(res,err);
    return res.status(200).json(results);
  });
}



function handleError(res, err) {
  return res.status(500).send(err);
}
