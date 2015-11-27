/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Packet = require('./session.model.js');

exports.register = function (socket) {

    Packet.schema.post('save', function (doc) {
        onSave(socket, doc);
    });
    Packet.schema.post('remove', function (doc) {
        onRemove(socket, doc);
    });

}

function onSave(socket, doc, cb) {
    socket.emit('socket:save', doc);
}

function onRemove(socket, doc, cb) {
    socket.emit('socket:remove', doc);
}
