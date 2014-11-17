/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Lecturemodel = require('./lectureModel.model');

exports.register = function(socket) {
  Lecturemodel.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Lecturemodel.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('lectureModel:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('lectureModel:remove', doc);
}