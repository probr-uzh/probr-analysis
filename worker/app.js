/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('mongoose');
var config = require('./config/environment');
var Log = require('./model/log.model');
var dateFormat = require('dateformat');

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

// Multi-Core Support through Cluster
var cluster = require('cluster')
var clusterWorkerSize = require('os').cpus().length;

if (cluster.isMaster) {
    console.log("detecting " + clusterWorkerSize + " CPU(s). forking...");
    for (var i = 0; i < clusterWorkerSize; i++) {
        cluster.fork();
    }
} else {
    console.log("worker up.");
    processJob('device');
    processJob('session');
    processJob('location');
}

function processJob(jobName) {
    queue.process(jobName, function (job, done) {

        // Helper function that persists and prints a log message.
        var logAndPrint = function(logType, logMessage, logData) {
            logMessage = jobName + '-job: ' + logMessage;
            var d = new Date();
            new Log({ time:d, job: jobName, type: logType, message: logMessage, data: logData }).save();
            console.log(dateFormat(d, '[yyyy-mm-dd HH:MM:ss] ') + logMessage);
        };

        // Create domain to catch any thrown errors and log them
        var domain = require('domain').create();

        // Log any error thrown in the domain and end the job.
        domain.on('error', function (err) {
            done(err, {name: jobName});
            logAndPrint('error', err);
        });

        // Run job in domain (to catch errors)
        domain.run(function () {
            logAndPrint('started', 'started at ' + new Date(job.started_at));

            require('./tasks/' + jobName)(job, function (returnData) {
                done(null, {name: jobName, duration: job.duration});
                logAndPrint('finished', 'finished in ' + job.duration / 1000 + ' seconds', returnData);
            });

        });

    });
}

process.on('SIGINT', function (code) {
    console.log('shutdown...');
    queue.shutdown(1000, function (err) {
        console.error('shutdown result: ', err || 'OK');
        process.exit(code);
    });
});
