/**
 * Created by gmazlami on 22.11.15.
 */
'use strict';

var express = require('express');
var controller = require('./device.controller');

var router = express.Router();

router.get('/query', controller.query);

router.get('/lastFive', controller.lastFive);

router.get('/lastHour', controller.lastHour);

router.get('/lastDay', controller.lastDay);

module.exports = router;
