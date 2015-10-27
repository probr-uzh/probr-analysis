/**
 * Created by gmazlami on 05.10.15.
 */

function getInitialMapReduceConfig() {
  return {
    map: function () {

      var result = {};

      result.mac_address = this.mac_address_src;
      result.startTimestamp = this.time;
      result.endTimestamp = this.time;
      result.tags = this.tags;
      result.count = 1;

      var slotSize = 1000 * 60 * 5;
      var roundedTime = Math.floor(this.time.getTime() / slotSize);

      emit({
        startTimestamp: new Date(roundedTime * slotSize),
        mac_address: this.mac_address_src
      }, result);

    },

    reduce: function (key, values) {
      return values.reduce(function (previous, current, index, array) {

        var mergedTags = previous.tags
        for (var tagIndex in current.tags) {
          var tag = current.tags[tagIndex]
          if (mergedTags.indexOf(tag) == -1) {
            mergedTags.push(tag);
          }
        }

        return {
          tags: mergedTags,
          mac_address: previous.mac_address,
          startTimestamp: new Date(Math.min(previous.startTimestamp.getTime(), current.startTimestamp.getTime())),
          endTimestamp: new Date(Math.max(previous.endTimestamp.getTime(), current.endTimestamp.getTime())),
          count: previous.count + current.count
        };
      });

    },
    sort: {mac_address_src: 1},
    out: {reduce: 'raw_sessions'},
  }
}


/*
 Returns a map reduce config object with the query property set to reduce only items inserted
 after the parameter gt_timestamp
 */
var getMapReduceIncremental = function (gt_timestamp) {
  var map_reduce_object_incremental = getInitialMapReduceConfig();
  map_reduce_object_incremental.query = {inserted_at: {$gt: gt_timestamp}};
  return map_reduce_object_incremental;
}

exports.mapReduceConfig = getInitialMapReduceConfig();
exports.getIncrementalMapReduceConfig = getMapReduceIncremental;
