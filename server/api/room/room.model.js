'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GeoJSONPoint = {'type': {type: String, default: "Point"}, coordinates: [{type: "Number"}]};
var GeoJSONGeometry = {'type': {type: String, enum: ["Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon"]}, coordinates: []};
var GeoJSONFeature = {id: {type: "String"}, 'type': {type: String, default: "Feature"}, geometry: GeoJSONGeometry, properties: {type: "Object"}};
var GeoJSONFeatureCollection = {'type': {type: String, default: "FeatureCollection"}, features: [GeoJSONFeature]};

var RoomSchema = new Schema({
    name: String,
    bounds: GeoJSONFeatureCollection
});

module.exports = mongoose.model('Room', RoomSchema);