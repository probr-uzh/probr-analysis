'use strict';

var url = require('url');

// Production specific configuration
// =================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
            'mongodb://localhost/spotr'
  },

  // RabbitMQ connection options
  rabbitmq: {
    uri: process.env.CLOUDAMQP_URL || 'amqp://localhost'
  },

  // Redis
  redis: {
    host: url.parse(process.env.REDIS_URL).hostname || 'localhost:6379',
    port: url.parse(process.env.REDIS_URL).port || 6379,
    password: url.parse(process.env.REDIS_URL).auth.split(":")[1] || ''
  },

};
