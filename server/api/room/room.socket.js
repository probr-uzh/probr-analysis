/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Room = require('./room.model');

exports.register = function(socket) {
  Room.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Room.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('room:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('room:remove', doc);
}