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
     *          }
     */
    function multilat(locs, multiplier) {
      if (locs.length < 3) {
        return undefined;
      }
      var poly = locationToCircle(locs[0], multiplier);
      var i=1;
      for (i=1; i<locs.length; i++) {
        var intersect = turf.intersect( poly, locationToCircle(locs[i], multiplier));
        if (intersect === undefined) {
          if (i > 2) {   // No intersection, but we have already 3 circles with intersection already, that's enough
            return {
              "centroid": turf.centroid(poly),
              "noOfCircles": i,
              "area": Math.round( turf.area(poly) * 100 ) / 100
            }
          } else
            return undefined;    // No intersection found with at least 3 circles
        }
        poly = intersect
      }
      return {
        "centroid": turf.centroid(poly),
        "noOfCircles": i,
        "area": Math.round( turf.area(poly) * 100 ) / 100
      }
    }

    var totalLocations = count;
    var locationStream = RawLocation.find(query).stream();

    locationStream.on('data', function (item) {
      if (counter % 500 == 0) {
        console.log("location-Job: forEach: raw_locations -> locations (" + Math.floor((counter / totalLocations) * 100) + "%)");
      }
      counter++;

      var noOfLocations = item.value.locations.length;

      // Only multilaterate when we have at least 3 circles
      if (noOfLocations >= 3) {
        var tries = 0;    // How many times the radius was increased
        var multiplier = 1.0;
        try {
          var result = multilat(item.value.locations, multiplier);
        } catch(err) {
          console.log("error during multilateration.\n" +
            " conflicting item was\n" +
            jsonify(item));
          return;
        }

        // Increase circle radius until at least three intersect
        // Must eventually succeed
        while (result === undefined) {
          multiplier *= 1.2;
          try {
            result = multilat(item.value.locations, multiplier);
          } catch(err) {
            console.log("error during multilateration.\n" +
              " conflicting item was\n" +
              jsonify(item));
            return;
          }
          tries++
        }

        // Save new location
        var d = new Location();
        d.mac_address = item.value.mac_address;
        d.time = item.value.time;
        d.location = result.centroid.geometry;
        d.area = result.area;
        d.noOfCircles = result.noOfCircles;
        d.multiplier = multiplier
        d.save();

      }

    }).on('error', function (err) {
      if (err) return cb(err);
    }).on('close', function () {
      cb();
    });

  });

};

exports.incremental = executeLocationForEach;

