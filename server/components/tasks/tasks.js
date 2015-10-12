module.exports = function (config) {

  // Kue Job-Queue
  var kue = require('kue'), queue = kue.createQueue({
    redis: {
      port: config.redis.port,
      host: config.redis.addr
    }
  });

  var createJob = function (jobName, jobOptions, interval) {

    // Remove Jobs from this type that are not yet being processed
    queue.active(function (err, ids) {
      ids.forEach(function (id) {
        kue.Job.get(id, function (err, job) {
          if (job.type === jobOptions.type && job.started_at === undefined) {
            job.remove(function () {
              console.log("removed unprocessed " + jobOptions.type + " job");
            });
          }
        });
      });
    });

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
