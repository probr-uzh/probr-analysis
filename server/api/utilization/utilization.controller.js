'use strict';

var _ = require('lodash');
var Packet = require('../packet/packet.model')
var Utilization = require('./utilization.model')

// Get list of utilizations
exports.punchcard = function (req, res) {

    var pipeline = [];

    if (req.query) {
        var match = {"$match": {"$and": []}};
        for (var param in req.query) {
            var obj = {};
            if (Array.isArray(req.query[param])) {
                obj[param] = {$in: req.query[param]};
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
        pipeline.push({"$match": {"$and": [{"mac_address_src": req.query.mac_address_src}]}});
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

// Get triangulation data
exports.triangulation = function (req, res) {

    // Determine Timeframe
    var begin = new Date(parseInt(req.query.begin));
    var end = new Date(parseInt(req.query.end));

    var mapReduceOptions = {};

    mapReduceOptions.map = function () {
        emit(this.time, {
            mac_address_src: this.mac_address_src,
            totalSignalStrength: this.signal_strength,
            weightedLongitude: this.location.coordinates[0] * this.signal_strength,
            weightedLatitude: this.location.coordinates[1] * this.signal_strength
        })
    }

    mapReduceOptions.reduce = function (key, values) {

        var totalSignalStrength = 0.0;
        var weightedLongitude = 0.0;
        var weightedLatitude = 0.0;
        var mac_address_src = values[0].mac_address_src;

        for (var i = 0; i < values.length; i++) {
            totalSignalStrength += values[i].totalSignalStrength;
            weightedLongitude += values[i].weightedLongitude;
            weightedLatitude += values[i].weightedLatitude;
        }

        return {
            mac_address_src: mac_address_src,
            totalSignalStrength: totalSignalStrength,
            weightedLongitude: weightedLongitude,
            weightedLatitude: weightedLatitude
        };
    }

    mapReduceOptions.finalize = function (key, result) {

        // GeoJSON Point
        result.location = {type: "Point", coordinates: [result.weightedLongitude / result.totalSignalStrength, result.weightedLatitude / result.totalSignalStrength]};

        // remove unnecessary output
        delete result.latitude;
        delete result.longitude;
        delete result.weightedLatitude;
        delete result.weightedLongitude;

        return result;
    }

    mapReduceOptions.query = {time: {'$gt': begin, '$lt': end}};
    mapReduceOptions.out = 'utilizations';

    // Check if we already did this query:
    Utilization.count({_id: mapReduceOptions.query.time}, function (err, count) {
        if (err) handleError(res, err);

        if (count > 0) {
            return res.status(200).json([]);
        } else {
            Packet.mapReduce(
                mapReduceOptions,
                function (err, result, stats) {
                    if (err) handleError(res, err);
                    return res.status(200).json(result);
                }
            );
        }
    });

};

function handleError(res, err) {
    return res.status(500).send(err);
}
