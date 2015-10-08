'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  api500px: {
    CONSUMER_KEY: 'fYJhhDz38lNOgf6GPtefmQ3tsDNtSwNa1IvU5jfA'
  },

  flickr: {
    API_KEY: '2ea422adf9ce954c1c95da0622e509f8',
    API_SECRET: '5374ec6a99e9ae70',
  },


};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
