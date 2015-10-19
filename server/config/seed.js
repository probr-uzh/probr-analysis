/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Room = require('../api/room/room.model');

User.find({}).remove(function () {
  User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@test.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin'
    }, function () {
      console.log('finished populating users');
    }
  );
});

Room.find({}).remove(function () {
  Room.create({
      name: 'Mensa',
      bounds: {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    8.549291999079287,
                    47.41420726372039
                  ],
                  [
                    8.549305410124362,
                    47.41424174933993
                  ],
                  [
                    8.549315468408167,
                    47.41427441990602
                  ],
                  [
                    8.54932485613972,
                    47.41434202976314
                  ],
                  [
                    8.54935570154339,
                    47.414339307220246
                  ],
                  [
                    8.54935570154339,
                    47.41435201241926
                  ],
                  [
                    8.549340278841555,
                    47.41435065114806
                  ],
                  [
                    8.54934296105057,
                    47.41441054704656
                  ],
                  [
                    8.549397946335375,
                    47.41440510196768
                  ],
                  [
                    8.549391911365092,
                    47.41436244883043
                  ],
                  [
                    8.549478412605822,
                    47.41435927253159
                  ],
                  [
                    8.549480424262583,
                    47.41437787656492
                  ],
                  [
                    8.54954479727894,
                    47.41437560778072
                  ],
                  [
                    8.549538762308657,
                    47.414312081783436
                  ],
                  [
                    8.54951395187527,
                    47.41431253554084
                  ],
                  [
                    8.549511269666255,
                    47.41428031875606
                  ],
                  [
                    8.549593077041209,
                    47.41427714245228
                  ],
                  [
                    8.549590394832194,
                    47.414229497872405
                  ],
                  [
                    8.549291999079287,
                    47.41420726372039
                  ]
                ]
              ]
            },
            "properties": {}
          }
        ]
      }
    }, {
      name: 'SEAL-Lab',
      bounds: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [8.549655, 47.414514],
                  [8.549651, 47.414479],
                  [8.549587, 47.414482],
                  [8.549590, 47.414517]
                ]
              ]
            }
          }]
      }
    }, {
      name: 'ACE-Lab',
      bounds: {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    8.549969770247117,
                    47.41469369037172
                  ],
                  [
                    8.549873881274834,
                    47.414698227912595
                  ],
                  [
                    8.54986784630455,
                    47.414651037468204
                  ],
                  [
                    8.549896009499207,
                    47.41464967620474
                  ],
                  [
                    8.54988930397667,
                    47.414587965558205
                  ],
                  [
                    8.549958370858803,
                    47.41458524302803
                  ],
                  [
                    8.549969770247117,
                    47.41469369037172
                  ]
                ]
              ]
            },
            "properties": {}
          }
        ]
      }
    }
    , function () {
      console.log('finished populating rooms');
    }
  );
});

