'use strict';

var express = require('express');
var controller = require('./packet.controller');

var router = express.Router();

router.get('/concurrency_count', controller.concurreny_count);
router.get('/punchcard_data', controller.punchcard_data);
router.get('/query', controller.query);
router.get('/countquery',controller.countquery);

module.exports = router;
