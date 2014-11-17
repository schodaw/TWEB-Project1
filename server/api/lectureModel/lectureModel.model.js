'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LecturemodelSchema = new Schema({
  title: String,
  author: String,
  pdfPath: String
});

module.exports = mongoose.model('Lecturemodel', LecturemodelSchema);