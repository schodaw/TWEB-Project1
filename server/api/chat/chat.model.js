/*
 * Model of chat message
 *
 * Components of a message :
 * - lectureId : number identification
 * - content : content of message
 * - author : username of the one who send the message
 * - time : sent time
 */

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