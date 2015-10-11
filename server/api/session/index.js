'use strict';

var express = require('express');
var controller = require('./session.controller');

var router = express.Router();

router.get('/concurrency_count/day', controller.concurreny_count_day);
router.get('/concurrency_count/week', controller.concurreny_count_week);

module.exports = router;
