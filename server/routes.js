/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var restify = require('express-restify-mongoose');
var express = require('express');

var TargetModel = require('./api/target/target.model');
var PacketModel = require('./api/packet/packet.model');
var SessionModel = require('./api/session/session.model');
var UtilizationModel = require('./api/utilization/utilization.model');
var DeviceModel = require('./api/device/device.model');
var LocationModel = require('./api/location/location.model');

module.exports = function (app) {

    // Insert routes below
    app.use('/api/rooms', require('./api/room'));
    app.use('/api/vendors', require('./api/vendor'));
    app.use('/api/utilization', require('./api/utilization'));
    app.use('/api/session', require('./api/session'));
    app.use('/api/loyalty', require('./api/loyalty'));
    app.use('/api/users', require('./api/user'));
    app.use('/api/device', require('./api/device'));

    app.use('/auth', require('./auth'));

    // Restify-Routes
    var router = express.Router();

    restify.serve(router, TargetModel, {
        lowercase: true, version: '',
    });

    restify.serve(router, PacketModel, {
        lowercase: true, version: '',
    });

    restify.serve(router, SessionModel, {
        lowercase: true, version: '',
    });

    restify.serve(router, UtilizationModel, {
        lowercase: true, version: '',
    });

    restify.serve(router, DeviceModel, {
        lowercase: true, version: '',
    });

    restify.serve(router, LocationModel, {
        lowercase: true, version: '',
    });

    app.use(router);

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    // All other routes should redirect to the index.html
    app.route('/*')
        .get(function (req, res) {
            res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
        });
};
