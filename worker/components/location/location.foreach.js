/**
 * Created by seebi on 12.10.15.
 */

var async = require('async');
var turf = require('turf'); // GIS library
var jsonify = require("json-stringify-safe");
var RawLocation = require('../../../server/api/location/raw_location.model.js');
var Location = require('../../../server/api/location/location.model.js');

/*
 The forEach job that uses multilateration to find a unique location
 for any device that was seen by multiple sniffing stations.
 */
var executeLocationForEach = function (gt_timestamp, cb) {

  var query = {};
  var counter = 0;

  if (gt_timestamp > null) {
    query = {"value.time": {$gt: gt_timestamp}};
  }

  RawLocation.count(query, function (err, count) {
    if (err) return cb(err);

    /***
     * Returns a turf.Polygon from a location
     * @param loc:  {lang: x, lat: x, weightedSignal: x}
     * @param multiplier:
     * @returns <turf.Polygon>
     */
    function locationToCircle(loc, multiplier) {
      var point = turf.point([loc.long,loc.lat]);
      var distance = signalToMeters(loc.weightedSignal, multiplier);

      var coordinates = [];
      for (var i=0; i<=360; i+=10) {
        coordinates.push( turf.destination(point, distance/1000, i, 'kilometers').geometry.coordinates );
      }
      var poly = turf.polygon([coordinates]);
      return poly;
    }

    /***
     * Estimates the distance to the divce in meters given a
     * signal strength parameter (rssi)
     * @param rssi: <Number> signal strength (negative, i.e. -64)
     * @param multiplier
     * @returns <Number> distance in meters
     */
    function signalToMeters(rssi, multiplier) {
      var distance = Math.pow(10, ((rssi*multiplier) + 38.45) / -15.08);
      return distance;
    }

    /***
     *
     * @param locs: Array of at least 3 locations
     * @param multiplier
     * @returns undefined if no intersection found
     *          { "centroid": <GeoJSON Point> the centoid of the intersecting polygon
     *            "noOfCircles" <Number> how many circles were intersected used (at least 3)
     *            "area" <Number> Square meters of intersecting polygin
     *            "multiplier" <Number>
     *            "derivedFrom": [<Location>]
     *          }
     */
    function multilat(locs) {
      var availableLocations = locs.length;
      var multiplier = 1/1.2;     // Will be multiplied by 1.2 if circles too small. 1.0 at first run.
      var noOfTrueIntersections;
      var circlesTooSmallForIntersection;
      var intersection;
      var derivedFrom = [];

      do {
        multiplier *= 1.2;
        circlesTooSmallForIntersection = 0;
        noOfTrueIntersections = 1;
        derivedFrom = [];

        // First intersection is just the first circle itself
        intersection = locationToCircle(locs[0], multiplier);
        derivedFrom.push(locs[0]);

        // Loop through all available locations/circles
        for(var i=1; i<availableLocations; i++) {
          // Intersect previous intersection with next circle
          var newIntersection = turf.intersect( intersection, locationToCircle(locs[i], multiplier));

          if ( newIntersection !== undefined ) {
            if ( turf.area(newIntersection) < turf.area(intersection) ) {
              noOfTrueIntersections++;
              intersection = newIntersection;
              derivedFrom.push(locs[i]);
            }
          } else {
            circlesTooSmallForIntersection++;
          }
        }

      } while(noOfTrueIntersections < 3 && (noOfTrueIntersections+circlesTooSmallForIntersection) >= 3);

      return {
        "centroid": turf.centroid(intersection),
        "noOfCircles": noOfTrueIntersections,
        "area": Math.round( turf.area(intersection) * 100 ) / 100,
        "multiplier": multiplier,
        "derivedFrom": derivedFrom
      }

    }

    var totalLocations = count;
    var locationStream = RawLocation.find(query).stream();

    // Loop through all raw_locations
    locationStream.on('data', function (item) {

      // Progress debug view
      if (counter % 500 == 0) {
        console.log("location-Job: forEach: raw_locations -> locations (" + Math.floor((counter / totalLocations) * 100) + "%)");
      }
      counter++;

      var result;
      try {
        result = multilat(item.value.locations);

        // Only persist locations that have more than 3 intersected circles
        if (result.noOfCircles >= 3) {

          // Persist location
          var d = new Location();
          d.mac_address = item.value.mac_address;
          d.time = item.value.time;
          d.location = result.centroid.geometry;
          d.area = result.area;
          d.noOfCircles = result.noOfCircles;
          d.multiplier = result.multiplier;
          d.derivedFrom = result.derivedFrom;
          d.save();
        }
      } catch(err) {
        console.log("location-Job: error during multilateration (maybe circles too large\n\t conflicting item:" + jsonify(item) );
      }


    }).on('error', function (err) {
      console.log("location-Job: error during location forEach. Aborting!");
      if (err) return cb(err);
    }).on('close', function () {
      cb();
    });

  });

};

exports.incremental = executeLocationForEach;

