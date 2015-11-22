/**
 * Created by seebi on 12.10.15.
 */

var Location = require('./../../server/api/location/location.model.js');
var Packet = require('./../../server/api/packet/packet.model.js');
var RawLocation = require('./../../server/api/location/raw_location.model.js');
var LocationMapReduce = require('../components/location/location.mapreduce');
var LocationForEach = require('../components/location/location.foreach');

module.exports = function (job, done) {
  // Check if collection exists
  RawLocation.find().sort("-value.time").limit(1).exec(function (err, rawLocations) {

    // Location collection has entries, start from last timestamp
    if (rawLocations[0] !== undefined) {
      var rawLocationsBreakTime = rawLocations[0].value.time;
      console.log("location-Job: found location collection and breakTime for incremental MapReduce");

      var mapReduceOptions = LocationMapReduce.getIncrementalMapReduceConfig(rawLocationsBreakTime);

      Packet.mapReduce(mapReduceOptions, function (err, results) {
        if (err) {
          console.log("location-Job: Error: " + err)
          done();
        } else {
          console.log("location-Job: forEach: raw_locations -> locations");
          Location.find().sort("-time").limit(1).exec(function (err, locations) {
            var locationBreakTime = locations[0].time;
            LocationForEach.incremental(locationBreakTime, function () {
              console.log("location-Job: forEach: raw_locations -> locations -> done");
              done();
            });
          });
        }
      });
    } else {
      // Location collection does not yet exist
      console.log("location-Job: no location collection found. full map-reduce run to create it.");

      Packet.mapReduce(LocationMapReduce.mapReduceConfig, function (err, results) {
        if (err) {
          console.log("location-Job: Error: " + err);
          done();
        } else {
          console.log("location-Job: full map reduce done.");
          console.log("location-Job: forEach: raw_locations -> locations");

          // Start forEach task
          LocationForEach.incremental(0, function () {
            console.log("location-Job: foreach: raw_locations -> locations -> done");
            done();
          });
        }
      });
    }

  });
};
