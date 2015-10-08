'use strict';

var url = require('url');

// Production specific configuration
// =================================
module.exports = {

    // MongoDB connection options
    mongo: {
        uri: 'mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT + '/probr-core' || 'mongodb://localhost:27017/probr-core'
    },

    // Redis connection options
    redis: {
        addr: process.env.REDIS_PORT_6379_TCP_ADDR || 'localhost',
        port: process.env.REDIS_PORT_6379_TCP_PORT || 6379
    }

};
