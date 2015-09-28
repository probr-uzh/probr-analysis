var CronJob = require('cron').CronJob;

var Packet = require('../api/packet/packet.model');
var Device = require('../api/device/device.model');


var breakTime = undefined;

Device.find().sort("-value.last_seen").limit(1).exec( function(err, doc) {

  //device collection already exists, so start the cronjob directly
  if(doc[0] !== undefined ){

    breakTime = doc[0].value.last_seen;
    console.log("CRON: Found device collection and breakTime for incremental MapReduce:  " + breakTime);
    console.log("CRON: Starting new CronJob");

    new CronJob({
      cronTime: '*/25 * * * * *',
      onTick: function () {

        //configure the map reduce job
        var mapReduceOptions = {};

        mapReduceOptions.map = function(){
          emit(this.mac_address_src,{mac_address: this.mac_address_src, vendor: this.vendor, last_seen:this.inserted_at});
        };

        mapReduceOptions.reduce = function(key, values) {
          var lastSeen = values[0].last_seen;
          for (i = 1; i < values.length; i++) {
            if (lastSeen > values[i].last_seen) {
              lastSeen = values[i].last_seen;
            }
          }
          return {mac_address: values[0].mac_address, vendor: values[0].vendor, last_seen: lastSeen};
        };

        mapReduceOptions.out = {reduce: 'device'};

        //only the packets since breakTime (excluding the first run, where breakTime is undefined since the device collections doesn't exist yet)
        mapReduceOptions.query = {inserted_at: {$gt : breakTime} }


        Packet.mapReduce(mapReduceOptions, function (err, results) {
          if(err){
            console.log("CRON: Error: " + err)
          }else{
            console.log("CRON: Finished with Result:" + results);
          }
        });

      }
    }).start();


  //device collection doesn't exist yet --> first mapreduce has to run full instead of incremental
  }else{
    console.log("CRON: No device collection found. First mapreduce as full run in order to create it.");

    var mapReduceOptions = {};

    mapReduceOptions.map = function(){
      emit(this.mac_address_src,{mac_address: this.mac_address_src, vendor: this.vendor, last_seen:this.inserted_at});
    };

    mapReduceOptions.reduce = function(key, values) {
      var lastSeen = values[0].last_seen;
      for (i = 1; i < values.length; i++) {
        if (lastSeen > values[i].last_seen) {
          lastSeen = values[i].last_seen;
        }
      }
      return {mac_address: values[0].mac_address, vendor: values[0].vendor, last_seen: lastSeen};
    };

    mapReduceOptions.out = {reduce: 'device'};

    //Kick off the incremental mapreduce in a cronjob at the end of the first run.
    Packet.mapReduce(mapReduceOptions, function (err, results) {
      if(err){
        console.log("CRON: Error: " + err)
      }else{
        console.log("CRON: Finished first full run, starting new CronJob for subsequent incremental MapReduce jobs." );

        new CronJob({
          cronTime: '*/25 * * * * *',
          onTick: function () {

            var latest_insert = undefined;

            Device.find().sort("-value.last_seen").limit(1).exec( function(err, doc) {
              if(doc[0] !== undefined ){
                latest_insert = doc[0].value.last_seen;
                console.log("CRON: Found latest_insert for incremental MapReduce:  " + latest_insert);

                //configure the map reduce job
                var mapReduceOptions = {};

                mapReduceOptions.map = function(){
                  emit(this.mac_address_src,{mac_address: this.mac_address_src, vendor: this.vendor, last_seen:this.inserted_at});
                };

                mapReduceOptions.reduce = function(key, values) {
                  var lastSeen = values[0].last_seen;
                  for (i = 1; i < values.length; i++) {
                    if (lastSeen > values[i].last_seen) {
                      lastSeen = values[i].last_seen;
                    }
                  }
                  return {mac_address: values[0].mac_address, vendor: values[0].vendor, last_seen: lastSeen};
                };

                mapReduceOptions.out = {reduce: 'device'};

                //only the packets since latest_insert
                mapReduceOptions.query = {inserted_at: {$gt : latest_insert} }


                Packet.mapReduce(mapReduceOptions, function (err, results) {
                  if(err){
                    console.log("CRON: Error during incremental mapreduce: " + err)
                  }else{
                    console.log("CRON: Finished device cron." );
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






//console.log("Started Packet->Device MapReduce Job!");
////new CronJob({
////  cronTime: '*/25 * * * * *',
////  onTick: function () {
//
//
//    //Find the entry in Device which has the latest "last_seen" and assign it to breakTime, in order to use it
//    //below in the map reduce query
//
//    var breakTime = undefined;
//
//
//    Device.find().sort("value.last_seen").limit(1).exec( function(err, doc) {
//      if(doc[0] !== undefined ){
//        breakTime = doc[0].value.last_seen;
//        console.log("CRON: Found breakTime for incremental MapReduce:  " + breakTime);
//      }else{
//        console.log("CRON: No breakTime in devices found. First mapreduce as full run.");
//        breakTime = undefined;
//      }
//    });
//
//
//    //configure the map reduce job
//    var mapReduceOptions = {};
//
//    mapReduceOptions.map = function(){
//        emit(this.mac_address_src,{mac_address: this.mac_address_src, vendor: this.vendor, last_seen:this.inserted_at});
//    };
//
//    mapReduceOptions.reduce = function(key, values) {
//      var lastSeen = values[0].last_seen;
//      for (i = 1; i < values.length; i++) {
//        if (lastSeen > values[i].last_seen) {
//          lastSeen = values[i].last_seen;
//        }
//      }
//      //print("Key: " + key + " last seen: " + lastSeen);
//      return {mac_address: values[0].mac_address, vendor: values[0].vendor, last_seen: lastSeen};
//    };
//
//    mapReduceOptions.out = {reduce: 'device'};
//
//    //only the packets since breakTime (excluding the first run, where breakTime is undefined since the device collections doesn't exist yet)
//    if(breakTime !== undefined){
//      mapReduceOptions.query = {inserted_at: {$gt : breakTime} }
//      console.log("CRON: MR only on packets inserted after " + breakTime);
//    }else{
//      console.log("CRON: MR on all packets.");
//    }
//
//
//    Packet.mapReduce(mapReduceOptions, function (err, results) {
//      if(err){
//        console.log("CRON: Error: " + err)
//      }else{
//        console.log("CRON: Result:" + results);
//      }
//    });
//
//  //}
////}).start();


