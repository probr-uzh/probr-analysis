#!/bin/sh

bower install --allow-root
npm install
grunt build
node server/app.js