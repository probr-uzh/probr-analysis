var CronJob = require('cron').CronJob;

var Packet = require('../api/packet/packet.model');
var RawDevice = require('../api/device/raw_device.model');
var Device = require('../api/device/device.model');
var Vendors = require('./vendor_db');


var breakTime = undefined;


var getMapReduceIncremental = function(gt_timestamp){

  var map_reduce_object_incremental = {
    map : function(){
      emit(this.mac_address_src,{mac_address: this.mac_address_src, vendor: this.vendor, last_seen:this.inserted_at});
    },

    reduce : function(key, values) {
      var lastSeen = values[0].last_seen;
      for (i = 1; i < values.length; i++) {
        if (lastSeen > values[i].last_seen) {
          lastSeen = values[i].last_seen;
        }
      }
      return {mac_address: values[0].mac_address, vendor: values[0].vendor, last_seen: lastSeen};
    },

    out : {reduce: 'raw_devices'},

    query : {inserted_at: {$gt : gt_timestamp} }

  };

  return map_reduce_object_incremental;
}


var map_reduce_object = {
  map : function(){
    emit(this.mac_address_src,{mac_address: this.mac_address_src, vendor: this.vendor, last_seen:this.inserted_at});
  },

  reduce : function(key, values) {
    var lastSeen = values[0].last_seen;
    for (i = 1; i < values.length; i++) {
      if (lastSeen > values[i].last_seen) {
        lastSeen = values[i].last_seen;
      }
    }
    return {mac_address: values[0].mac_address, vendor: values[0].vendor, last_seen: lastSeen};
  },

  out : {reduce: 'raw_devices'},
};





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

        var mapReduceOptions = getMapReduceIncremental(breakTime);
        //var mapReduceOptions = {};

        //mapReduceOptions.map = function(){
        //  emit(this.mac_address_src,{mac_address: this.mac_address_src, vendor: this.vendor, last_seen:this.inserted_at});
        //};
        //
        //mapReduceOptions.reduce = function(key, values) {
        //  var lastSeen = values[0].last_seen;
        //  for (i = 1; i < values.length; i++) {
        //    if (lastSeen > values[i].last_seen) {
        //      lastSeen = values[i].last_seen;
        //    }
        //  }
        //  return {mac_address: values[0].mac_address, vendor: values[0].vendor, last_seen: lastSeen};
        //};
        //
        //mapReduceOptions.out = {reduce: 'raw_devices'};
        //
        ////only the packets since breakTime (excluding the first run, where breakTime is undefined since the device collections doesn't exist yet)
        //mapReduceOptions.query = {inserted_at: {$gt : breakTime} };

        Packet.mapReduce(mapReduceOptions, function (err, results) {
          if(err){
            console.log("CRON: Error: " + err)
          }else{
            console.log("CRON: Finished.");

            //RawDevice.find().exec(function(err,docs){
            //  docs.forEach(function(element, index, array){
            //    Device.findOne({mac_address: element.value.mac_address}).exec(function(err,result){
            //      if(err){
            //        console.log("CRON: Error during forEach from raw_devices -> devices.");
            //      }
            //      else if(!result){ //there are no devices with the given mac address
            //        var d = new Device();
            //        d.mac_address = element.value.mac_address;
            //        d.vendor = Vendors.vendors[element.value.mac_address.substr(0,6)];
            //        d.last_seen = element.value.last_seen;
            //        d.save();
            //        console.log("New Device: " + d);
            //      }else{ //The device already exists in the collection --> only update the last_seen timestamp
            //        result.last_seen = element.value.last_seen;
            //        result.save();
            //        console.log("Updated existing device: " + result);
            //      }
            //    });
            //  });
            //});


          }
        });

      }
    }).start();


  //device collection doesn't exist yet --> first mapreduce has to run full instead of incremental
  }else{
    console.log("CRON: No raw_device collection found. First mapreduce as full run in order to create it.");

    var mapReduceOptions = map_reduce_object;

    //var mapReduceOptions = {};
    //
    //mapReduceOptions.map = function(){
    //  emit(this.mac_address_src,{mac_address: this.mac_address_src, vendor: this.vendor, last_seen:this.inserted_at});
    //};
    //
    //mapReduceOptions.reduce = function(key, values) {
    //  var lastSeen = values[0].last_seen;
    //  for (i = 1; i < values.length; i++) {
    //    if (lastSeen > values[i].last_seen) {
    //      lastSeen = values[i].last_seen;
    //    }
    //  }
    //  return {mac_address: values[0].mac_address, vendor: values[0].vendor, last_seen: lastSeen};
    //};
    //
    //mapReduceOptions.out = {reduce: 'raw_devices'};

    Packet.mapReduce(mapReduceOptions, function (err, results) {
      if(err){
        console.log("CRON: Error: " + err)
      }else{
        console.log("CRON: Finished first full run, starting new CronJob for subsequent incremental MapReduce jobs." );


        //forEach which iterates over all raw_devices and flattens their structure and adds the vendor, and puts that into
        //the final devices collection

        //RawDevice.find().exec(function(err,docs){
        //  docs.forEach(function(element, index, array){
        //    var d = new Device();
        //    d.mac_address = element.value.mac_address;
        //    d.vendor = Vendors.vendors[element.value.mac_address.substr(0,6)];
        //    d.last_seen = element.value.last_seen;
        //    d.save();
        //    console.log("New Device: " + d);
        //  });
        //});


        //now start the actual cronjob to do the regular incremental mapreduce plus the foreach
        new CronJob({
          cronTime: '*/25 * * * * *',
          onTick: function () {

            var latest_insert = undefined;

            RawDevice.find().sort("-value.last_seen").limit(1).exec( function(err, doc) {
              if(doc[0] !== undefined ){
                latest_insert = doc[0].value.last_seen;
                console.log("CRON: Found latest_insert for incremental MapReduce:  " + latest_insert);

                var mapReduceOptions = getMapReduceIncremental(latest_insert);

                //configure the map reduce job
                //var mapReduceOptions = {};
                //
                //mapReduceOptions.map = function(){
                //  emit(this.mac_address_src,{mac_address: this.mac_address_src, vendor: this.vendor, last_seen:this.inserted_at});
                //};
                //
                //mapReduceOptions.reduce = function(key, values) {
                //  var lastSeen = values[0].last_seen;
                //  for (i = 1; i < values.length; i++) {
                //    if (lastSeen > values[i].last_seen) {
                //      lastSeen = values[i].last_seen;
                //    }
                //  }
                //  return {mac_address: values[0].mac_address, vendor: values[0].vendor, last_seen: lastSeen};
                //};
                //
                //mapReduceOptions.out = {reduce: 'raw_devices'};
                //
                ////only the packets since latest_insert
                //mapReduceOptions.query = {inserted_at: {$gt : latest_insert} }

                Packet.mapReduce(mapReduceOptions, function (err, results) {
                  if(err){
                    console.log("CRON: Error during incremental mapreduce: " + err)
                  }else{
                    console.log("CRON: Finished device cron." );

                    //RawDevice.find().exec(function(err,docs){
                    //  docs.forEach(function(element, index, array){
                    //    Device.findOne({mac_address: element.value.mac_address}).exec(function(err,result){
                    //      if(err){
                    //        console.log("CRON: Error during forEach from raw_devices -> devices.");
                    //      }
                    //      else if(!result){ //there are no devices with the given mac address
                    //        var d = new Device();
                    //        d.mac_address = element.value.mac_address;
                    //        d.vendor = Vendors.vendors[element.value.mac_address.substr(0,6)];
                    //        d.last_seen = element.value.last_seen;
                    //        d.save();
                    //        console.log("New Device: " + d);
                    //      }else{ //The device already exists in the collection --> only update the last_seen timestamp
                    //        result.last_seen = element.value.last_seen;
                    //        result.save();
                    //        console.log("Updated existing device: " + result);
                    //      }
                    //    });
                    //  });
                    //});

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


