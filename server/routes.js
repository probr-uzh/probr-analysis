/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var restify = require('express-restify-mongoose');
var express = require('express');
var PacketModel = require('./api/packet/packet.model')

module.exports = function(app) {

  // Insert routes below
  app.use('/api/vendors', require('./api/vendor'));
  app.use('/api/utilization', require('./api/utilization'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // Restify-Routes
  var router = express.Router();
  restify.serve(router, PacketModel, { lowercase: true, version: '' });

  app.use(router);
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
