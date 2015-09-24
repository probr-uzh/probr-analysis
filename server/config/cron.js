var CronJob = require('cron').CronJob;

var Packet = require('../api/packet/packet.model');
var Device = require('../api/device/device.model');

console.log("Started Packet->Device MapReduce Job!");
new CronJob({
  cronTime: '*/5 * * * * *',
  onTick: function () {


    //find the current latest last_seen date in device collection
    var breakTime = new Date();


    //TODO: Find the entry in Device which has the latest "last_seen" and assign it to breakTime, in order to use it
    //below in the map reduce query

    //Device.find().sort({ "value.last_seen": 1 }).exec(function(err, model) {
    //    console.log("Error: " + err);
    //    console.log("Result: " + model);
    //});

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
      //print("Key: " + key + " last seen: " + lastSeen);
      return {mac_address: values[0].mac_address, vendor: values[0].vendor, last_seen: lastSeen};
    };

    mapReduceOptions.out = {reduce: 'Device'};

    //only the packets since breakTime
    mapReduceOptions.query = {inserted_at: {$gt : breakTime} }


    Packet.mapReduce(mapReduceOptions, function (err, results) {
      if(err){
        console.log("Error: " + err)
      }else{
        console.log("Result:" + results);
      }
    });

  },
}).start();


