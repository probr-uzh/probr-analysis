'use strict';
var path = require('path');



// Production specific configuration
// =================================
module.exports = {
    // Server IP
    ip: process.env.OPENSHIFT_NODEJS_IP ||
    process.env.IP ||
    undefined,

    root: path.normalize(__dirname + '/../../../dist/'),

    // Server port
    port: process.env.OPENSHIFT_NODEJS_PORT ||
    process.env.PORT ||
    8080,

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
