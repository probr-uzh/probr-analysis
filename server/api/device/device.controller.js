'use strict';

var _ = require('lodash');
var Device = require('./device.model')

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
  startTimestamp = new Date(parseInt(startTimestamp)*1000);

  var endTimestamp = req.query["endTimestamp"];
  endTimestamp = new Date(parseInt(endTimestamp)*1000);


  //if there are timestamps, put them into query
  if(startTimestamp !== undefined && endTimestamp !== undefined){
    var expression = [];
    expression.push({last_seen : {$gt: startTimestamp}});
    expression.push({last_seen : {$lt: endTimestamp}});
    query.$and = expression;
  }


  Device.find(query, function(err,results){
    //console.log(results);
    if (err) handleError(res, err);
    return res.status(200).json(results);
  });

};


function handleError(res, err) {
  return res.status(500).send(err);
}
