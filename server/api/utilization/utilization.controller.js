'use strict';

var _ = require('lodash');
var Packet = require('../packet/packet.model')

// Get list of utilizations
exports.punchcard = function (req, res) {

    Packet.aggregate({
        "$group": {
            "_id": {"$dateToString": {"format": "%w-%H", "date": "$timestamp"}},
            "count": {"$sum": 1}
        }
    }).exec(function (err, result) {
        if (err) handleError(res, err);
        return res.status(200).json(result);
    });

};

// Get a single utilization
exports.max = function (req, res) {

    Packet.aggregate({
        "$group": {
            "_id": {"$dateToString": {"format": "%Y-%m-%d-%H", "date": "$timestamp"}},
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
