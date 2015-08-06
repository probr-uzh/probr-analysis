'use strict';

var _ = require('lodash');

// Get list of vendors
exports.index = function(req, res) {



};

function handleError(res, err) {
  return res.status(500).send(err);
}