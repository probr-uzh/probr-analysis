/**
 * Created by gmazlami on 05.10.15.
 */

exports.mapReduceConfig = function (options) {

    var SESSION_TIMEOUT = 20; // minutes

    var map = function() {
        var key = this.mac_address_src;
        var value = {
            "sessions": [{
                address: this.mac_address_src,
                startTimestamp: this.time,      // Single packate produces zero
                endTimestamp: this.time,        // length session
                count: 1,
                tags: this.tags,
                weightedSignalStrength: this.signal_strength,
                duration: 0                     // In seconds
            }],
            "noOfSessions": 1
        };

        emit(key, value);
    };

    var reduce = function(k, values) {
        // Values: [ {"sessions": [<session>, <session>, ...]} ]
        var merged = [].concat.apply([],values.map(function(s){return s.sessions}));
        var sorted = merged.sort(function(a,b) {return a.startTimestamp - b.startTimestamp;});

        var res = [];
        var prev = sorted[0];
        for (var i=1; i<sorted.length; i++) {
            var curr = sorted[i];

            // Merge if the session is SESSION_TIMEOUT min close to previous session
            if (curr.startTimestamp.valueOf() <= prev.endTimestamp.valueOf() + 1000*60*SESSION_TIMEOUT) {
                prev.endTimestamp = curr.endTimestamp;
                prev.duration = Math.floor((prev.endTimestamp.valueOf() - prev.startTimestamp.valueOf()) / 1000);
                prev.weightedSignalStrength = Math.floor((prev.weightedSignalStrength*prev.count + curr.weightedSignalStrength)/(prev.count+1));
                for(tag in curr.tags) {
                    if(prev.tags && prev.tags.indexOf(curr.tags[tag]) === -1) {
                        prev.tags.push(curr.tags[tag]);
                    }
                }
                prev.count = prev.count + 1;
            } else {
                res.push(prev);
                prev = curr;
            }
        }
        // Handle last element
        res.push(prev);

        return {"sessions": res, "noOfSessions": res.length};
    };

    // Default opts
    var mrOpts = {
        mapReduce: "packets",
        map: map,
        reduce: reduce,
        scope: { SESSION_TIMEOUT: SESSION_TIMEOUT },
        out: {reduce: "raw_sessions"},
        query: {signal_strength:{$gt: -55}}
    };

    // Add/override custom options
    if (options) {
        for(o in options) {
            if(options.hasOwnProperty(o))
                mrOpts[o] = options[o];
        }
    }

    return mrOpts;
};

