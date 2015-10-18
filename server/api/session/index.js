'use strict';

var express = require('express');
var controller = require('./session.controller');

var router = express.Router();

router.get('/reduce', controller.reduce);

module.exports = router;
