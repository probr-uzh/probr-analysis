/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Kue Job-Queue
var kue = require('kue'), queue = kue.createQueue({
    prefix: 'q',
    redis: {
        port: config.redis.port,
        host: config.redis.addr
    }
});

function processJob(jobName) {
    queue.process(jobName, function (job, done) {

        var domain = require('domain').create();

        domain.on('error', function (err) {
            console.error(err);
            done(err, {name: jobName });
        });

        domain.run(function () {

            console.log(jobName + "-Job: started at " + job.started_at);

            require('./tasks/' + jobName)(job, function () {
                done(null, {name: jobName, duration: job.duration});
                console.log(jobName + "-Job: finished in " + job.duration / 1000 + " seconds");
            });

        });

    });
}

process.on('SIGINT', function(code) {
    console.log('shutdown...');
    queue.shutdown(1000, function(err){
        console.error('shutdown result: ', err || 'OK' );
        process.exit(code);
    });
});

processJob('device');
processJob('session');