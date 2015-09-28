'use strict';

var express = require('express');
var controller = require('./loyalty.controller');

var router = express.Router();

router.get('/histogram', controller.histogram);

module.exports = router;
