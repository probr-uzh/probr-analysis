/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('mongoose');
var config = require('./config/environment');
var amqp = require('amqplib/callback_api');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// TaskQueue
var queue = 'task_queue';

// SocketIO
var io = require('socket.io')();
var adapter = require('socket.io-redis');
var redis = require('redis').createClient;
var pub = redis(config.redis.port, config.redis.host, { auth_pass: config.redis.password });
var sub = redis(config.redis.port, config.redis.host, { detect_buffers: true, auth_pass: config.redis.password });
io.adapter(adapter({ pubClient: pub, subClient: sub }));

// Connect to RabbitMQ and attach work-handlers
amqp.connect(config.rabbitmq.uri, function (err, connection) {
  require('./tasks/processQuery')(queue, connection, io);
});
