/**
 * Created by seebi on 12.10.15.
 */

function getInitialMapReduceConfig() {
  return {
    map: function () {
      var locs = [];
      var loc = {
        long: this.location.coordinates[0],
        lat: this.location.coordinates[1],
        weightedSignal: this.signal_strength,
        cnt: 1
      };
      locs.push(loc);

      var timeRoundedToMinutes = Math.floor(this.time.getTime() / (1000 * 60));

      emit({
        time: timeRoundedToMinutes * 60 * 1000,
        mac_address: this.mac_address_src
      }, {
        time: timeRoundedToMinutes * 60 * 1000,
        mac_address: this.mac_address_src,
        numberOfLocations: 1,
        locations: locs
      });
    },

    reduce: function (key, values) {
      var getLocPos = function(arr, long, lat) {
        var found = false;
        for(var i=0; i<arr.length; i++) {
          if(arr[i].long === long && arr[i].lat === lat) {
            found = i;
            break;
          }
        }
        return found;
      };

      var locs = [];
      var numberOfLocations = 0;

      for (var i=0; i<values.length; i++) {
        var value = values[i];

        for(var j=0; j<value.locations.length; j++) {
          var loc = value.locations[j];
          var pos = getLocPos(locs, loc.long, loc.lat);

          if (pos !== false) {
            // Entry with same location exists, merge and calculated new weighted signal strength
            var oldLoc = locs[pos];
            oldLoc.weightedSignal = (oldLoc.cnt * oldLoc.weightedSignal + loc.weightedSignal) / (oldLoc.cnt + 1);
            oldLoc.cnt = oldLoc.cnt + 1;
            locs[pos] = oldLoc;
          } else {
            // New location
            numberOfLocations++;
            locs.push(loc);
          }
        }
      }

      return {
        time: key.time,
        mac_address: key.mac_address,
        numberOfLocations: numberOfLocations,
        locations: locs
      };
    },
    out: {reduce: 'raw_locations'}
  };
}

/*
 Returns a map reduce config object with the query property set to reduce only items inserted
 after the parameter gt_timestamp
 */
var getMapReduceIncremental = function (gt_timestamp) {
  var map_reduce_object_incremental = getInitialMapReduceConfig();
  map_reduce_object_incremental.query = {time: {$gt: gt_timestamp}};
  return map_reduce_object_incremental;
};

exports.mapReduceConfig = getInitialMapReduceConfig();
exports.getIncrementalMapReduceConfig = getMapReduceIncremental;
