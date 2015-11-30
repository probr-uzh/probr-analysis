/**
 * Created by gmazlami on 22.11.15.
 */
'use strict';

var express = require('express');
var controller = require('./device.controller');

var router = express.Router();

router.get('/query', controller.query);

module.exports = router;
