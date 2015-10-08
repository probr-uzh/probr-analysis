module.exports = function (config) {

    // Kue Job-Queue
    var kue = require('kue'), queue = kue.createQueue({
        redis: {
            port: config.redis.port,
            host: config.redis.addr
        }
    });

    var createJob = function (jobName, jobOptions, interval) {
        queue.create(jobName, jobOptions).on('complete', function (result) {
            //console.log("kue - job complete with result ", result);
            setTimeout(function () {
                createJob(jobName, jobOptions, interval);
            }, interval);

        }).on('failed attempt', function (errorMessage, doneAttempts) {
            console.log('kue - job failed ' + JSON.stringify(errorMessage));

            setTimeout(function () {
                createJob(jobName, jobOptions, interval);
            }, interval);

        }).on('failed', function (errorMessage) {
            console.log('kue - job failed ' + JSON.stringify(errorMessage));

            setTimeout(function () {
                createJob(jobName, jobOptions, interval);
            }, interval);

        }).on('progress', function (progress, data) {
            console.log('kue - job #' + job.id + ' ' + progress + '% complete with data ', data);
        }).removeOnComplete(true).save();
    }

    return {createJob: createJob};
}