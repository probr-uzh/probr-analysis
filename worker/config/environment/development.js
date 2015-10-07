'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/spotr-dev'
  },

  // RabbitMQ connection options
  rabbitmq: {
    uri: 'amqp://localhost'
  },

  // Redis
  redis: {
    host: 'localhost',
    port: 6379,
    password: ''
  },

};
