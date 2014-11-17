'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LectureSchema = new Schema({
  title: String,
  author: String,
  pdfPath: String,
  currentPage: Number
});

module.exports = mongoose.model('Lecture', LectureSchema);