'use strict';

var _ = require('lodash');
var Device = require('./device.model')


exports.lastFive = function (req, res){

    var lastFiveMinDate = new Date();
    lastFiveMinDate.setMinutes(lastFiveMinDate.getMinutes() -5);

    console.log(lastFiveMinDate);
    var query = {last_seen : {$gt : lastFiveMinDate}};

    Device.find(query, function(err,results){
        if (err) handleError(res, err);
        return res.status(200).json(results);
    });
};

exports.lastHour = function (req, res){

    var lastHour = new Date();
    lastHour.setHours(lastHour.getHours() -1);
    console.log(lastHour);

    var query = {last_seen : {$gt : lastHour}};

    Device.find(query, function(err,results){
        if (err) handleError(res, err);
        return res.status(200).json(results);
    });
};


exports.lastDay = function (req, res){

    var lastDay = new Date();
    lastDay.setDate(lastDay.getDate() -1);

    console.log(lastDay);

    var query = {last_seen : {$gt : lastDay}};

    Device.find(query, function(err,results){
        if (err) handleError(res, err);
        return res.status(200).json(results);
    });
};




// Get list of utilizations
exports.query = function (req, res) {
  var query = {};

  var tags = req.query["tags"];

  //if there are tags, split the to an array and put into query
  if(tags !== undefined){
    tags = tags.split(",");

    if(tags.length < 2){
      tags = [tags];
    }

    query.tags = {$all: tags};
  }

  var startTimestamp = req.query["startTimestamp"];

  var endTimestamp = req.query["endTimestamp"];


  //if there are timestamps, put them into query
  if(startTimestamp !== undefined && endTimestamp !== undefined){
    var expression = [];

    startTimestamp = new Date(parseInt(startTimestamp));
    endTimestamp = new Date(parseInt(endTimestamp));

    expression.push({last_seen : {$gt: startTimestamp}});
    expression.push({last_seen : {$lt: endTimestamp}});
    query.$and = expression;
  }


  Device.find(query, function(err,results){
    if (err) handleError(res, err);
    return res.status(200).json(results);
  });

};


function handleError(res, err) {
  return res.status(500).send(err);
}
