'use strict';

var express = require('express');
var controller = require('./utilization.controller');

var router = express.Router();

router.get('/punchcard', controller.punchcard);
router.get('/max', controller.max);
router.get('/triangulation', controller.triangulation);

module.exports = router;
