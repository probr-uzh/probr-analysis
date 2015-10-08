'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/probr-core'
  },

  // Redis connection options
  redis: {
    addr: 'localhost',
    port: 6379
  },

};
