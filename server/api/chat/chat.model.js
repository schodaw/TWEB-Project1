'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChatSchema = new Schema({
  lectureId: String,
  content: String,
  author: String,
  time: String
});

module.exports = mongoose.model('Chat', ChatSchema);