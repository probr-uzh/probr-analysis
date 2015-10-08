/**
 * Created by gmazlami on 05.10.15.
 */

function getInitialMapReduceConfig() {
    return {
        map: function () {
            var result = {};
            result.mac_address = this.mac_address_src;
            result.startTimestamp = this.time.getTime();
            result.endTimestamp = this.time.getTime();
            result.tags = this.tags;

            var locationAsString = this.location.coordinates[0] + "," + this.location.coordinates[1];
            var undottedLocationString = locationAsString.replace(",", "_");
            undottedLocationString = undottedLocationString.replace(".", ",");
            undottedLocationString = undottedLocationString.replace(".", ",");
            result.locations = {};
            result.locations[undottedLocationString] = {
                weightedSignalStrength: this.signal_strength,
                locationCount: 1
            }

            result.weightedSignalStrength = this.signal_strength
            result.count = 1;

            emit(this.mac_address_src + "_" + Math.floor(this.time.getTime() / (1000 * 60 * 5)), result);
        },

        reduce: function (key, values) {
            return values.reduce(function (previous, current, index, array) {
                var mergedLocations = previous.locations
                for (var locationName in current.locations) {
                    if (locationName in mergedLocations) {
                        mergedLocations[locationName]["weightedSignalStrength"] += current.locations[locationName]["weightedSignalStrength"];
                        mergedLocations[locationName]["locationCount"] += current.locations[locationName]["locationCount"];
                    } else {
                        mergedLocations[locationName] = current.locations[locationName]
                    }
                }

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
                    startTimestamp: Math.min(previous.startTimestamp, current.startTimestamp),
                    endTimestamp: Math.max(previous.endTimestamp, current.endTimestamp),
                    weightedSignalStrength: previous.weightedSignalStrength + current.weightedSignalStrength,
                    locations: mergedLocations,
                    count: previous.count + current.count
                };
            });
        },
        sort: { mac_address_src: 1 },
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