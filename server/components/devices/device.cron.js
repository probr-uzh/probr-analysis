var CronJob = require('cron').CronJob;

var Packet = require('../../api/packet/packet.model.js');
var RawDevice = require('../../api/device/raw_device.model.js');
var Device = require('../../api/device/device.model.js');
var DeviceMapReduce = require('./device.mapreduce');
var DeviceForEach = require('./device.foreach');




var breakTime = undefined;

RawDevice.find().sort("-value.last_seen").limit(1).exec( function(err, doc) {

  //device collection already exists, so start the cronjob directly
  if(doc[0] !== undefined ){

    breakTime = doc[0].value.last_seen;
    console.log("CRON: Found raw_device collection and breakTime for incremental MapReduce:  " + breakTime);
    console.log("CRON: Starting new CronJob");

    new CronJob({
      cronTime: '*/25 * * * * *',
      onTick: function () {

        //configure the map reduce job
        var mapReduceOptions = DeviceMapReduce.getIncrementalMapReduceConfig(breakTime);

        Packet.mapReduce(mapReduceOptions, function (err, results) {
          if(err){
            console.log("CRON: Error: " + err)
          }else{
            console.log("CRON: Finished device cron. Starting forEach: raw_devices -> devices" );

            DeviceForEach.incremental(breakTime);
          }
        });

      }
    }).start();


  //device collection doesn't exist yet --> first mapreduce has to run full instead of incremental
  }else{
    console.log("CRON: No raw_device collection found. First mapreduce as full run in order to create it.");

    var mapReduceOptions = DeviceMapReduce.mapReduceConfig;

    Packet.mapReduce(mapReduceOptions, function (err, results) {
      if(err){
        console.log("CRON: Error: " + err)
      }else{
        console.log("CRON: Finished first full run, starting new CronJob for subsequent incremental MapReduce jobs." );


        //forEach which iterates over all raw_devices and flattens their structure and adds the vendor, and puts that into
        //the final devices collection

        DeviceForEach.full();

        //now start the actual cronjob to do the regular incremental mapreduce plus the foreach
        new CronJob({
          cronTime: '*/25 * * * * *',
          onTick: function () {

            var latest_insert = undefined;

            RawDevice.find().sort("-value.last_seen").limit(1).exec( function(err, doc) {
              if(doc[0] !== undefined ){
                latest_insert = doc[0].value.last_seen;
                console.log("CRON: Found latest_insert for incremental MapReduce:  " + latest_insert);

                var mapReduceOptions = DeviceMapReduce.getIncrementalMapReduceConfig(latest_insert);

                Packet.mapReduce(mapReduceOptions, function (err, results) {
                  if(err){
                    console.log("CRON: Error during incremental mapreduce: " + err)
                  }else{
                    console.log("CRON: Finished device cron. Starting forEach: raw_devices -> devices" );

                    DeviceForEach.incremental(latest_insert);
                  }
                });
              }
            });
          }
        }).start();
      }
    });
  }
});


