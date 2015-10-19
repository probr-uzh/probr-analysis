'use strict';

var express = require('express');
var controller = require('./session.controller');

var router = express.Router();

router.get('/concurrency_count/', controller.concurreny_count);

module.exports = router;
