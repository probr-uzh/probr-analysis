var CronJob = require('cron').CronJob;

var Packet = require('../api/packet/packet.model');
var RawDevice = require('../api/device/raw_device.model');
var Device = require('../api/device/device.model');
var Vendors = require('./vendor_db');




/*
Returns a map reduce config object with the query property set to reduce only items inserted
after the parameter gt_timestamp
*/
var getMapReduceIncremental = function(gt_timestamp){

  var map_reduce_object_incremental = {
    map : function(){
      emit(this.mac_address_src,{mac_address: this.mac_address_src, vendor: this.vendor, last_seen:this.inserted_at});
    },

    reduce : function(key, values) {
      var lastSeen = values[0].last_seen;
      for (i = 1; i < values.length; i++) {
        if (lastSeen < values[i].last_seen) {
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

/*
Serves as a map reduce config object for the normal full map reduce on the packets collections to identify
devices
*/
var map_reduce_object = {
  map : function(){
    emit(this.mac_address_src,{mac_address: this.mac_address_src, vendor: this.vendor, last_seen:this.inserted_at});
  },

  reduce : function(key, values) {
    var lastSeen = values[0].last_seen;
    for (i = 1; i < values.length; i++) {
      if (lastSeen < values[i].last_seen) {
        lastSeen = values[i].last_seen;
      }
    }
    return {mac_address: values[0].mac_address, vendor: values[0].vendor, last_seen: lastSeen};
  },

  out : {reduce: 'raw_devices'},
};

/*
The forEach job that flattens the raw_devices structure and looks up the vendors, and then puts it into the
devices collection. This function checks if the corresponding device entry already exists before updating.
*/
var executeDeviceForEach = function(gt_timestamp){
  RawDevice.find({"value.last_seen" : {$gt: gt_timestamp}}).exec(function(err,docs){
    docs.forEach(function(element, index, array){
      Device.findOne({mac_address: element.value.mac_address}).exec(function(err,result){
        if(err){
          console.log("CRON: Error during forEach from raw_devices -> devices.");
        }
        else if(!result){ //there are no devices with the given mac address
          var d = new Device();
          d.mac_address = element.value.mac_address;
          d.vendor = Vendors.vendors[element.value.mac_address.substr(0,6)];
          d.last_seen = element.value.last_seen;
          d.save();
        }else{ //The device already exists in the collection --> only update the last_seen timestamp
          if(result.last_seen < element.value.last_seen){
            result.last_seen = element.value.last_seen;
            result.save();
          }
        }
      });
    });
  });
}


/*
 The forEach job that flattens the raw_devices structure and looks up the vendors, and then puts it into the
 devices collection. This function doesn't check if the corresponding device entry already exists before updating, so only use it on the first run of the cron.
 */

var initialDeviceForEach = function(){
  RawDevice.find().exec(function(err,docs){
    docs.forEach(function(element, index, array){
      var d = new Device();
      d.mac_address = element.value.mac_address;
      d.vendor = Vendors.vendors[element.value.mac_address.substr(0,6)];
      d.last_seen = element.value.last_seen;
      d.save();
    });
  });
}

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
        var mapReduceOptions = getMapReduceIncremental(breakTime);

        Packet.mapReduce(mapReduceOptions, function (err, results) {
          if(err){
            console.log("CRON: Error: " + err)
          }else{
            console.log("CRON: Finished device cron. Starting forEach: raw_devices -> devices" );

            executeDeviceForEach(breakTime);
          }
        });

      }
    }).start();


  //device collection doesn't exist yet --> first mapreduce has to run full instead of incremental
  }else{
    console.log("CRON: No raw_device collection found. First mapreduce as full run in order to create it.");

    var mapReduceOptions = map_reduce_object;

    Packet.mapReduce(mapReduceOptions, function (err, results) {
      if(err){
        console.log("CRON: Error: " + err)
      }else{
        console.log("CRON: Finished first full run, starting new CronJob for subsequent incremental MapReduce jobs." );


        //forEach which iterates over all raw_devices and flattens their structure and adds the vendor, and puts that into
        //the final devices collection

        initialDeviceForEach();

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

                Packet.mapReduce(mapReduceOptions, function (err, results) {
                  if(err){
                    console.log("CRON: Error during incremental mapreduce: " + err)
                  }else{
                    console.log("CRON: Finished device cron. Starting forEach: raw_devices -> devices" );
                    executeDeviceForEach(latest_insert);
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


