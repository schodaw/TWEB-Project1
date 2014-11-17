/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Lecture = require('./lecture.model');

exports.register = function(socket) {
  Lecture.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Lecture.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
    
  socket.on('changePage', function(data) {
    console.info('serveur a recu page : %s', data.pageNum);
    socket.broadcast.emit('changePage', data);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('lecture:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('lecture:remove', doc);
}