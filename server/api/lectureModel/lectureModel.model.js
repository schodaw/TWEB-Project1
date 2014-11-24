/*
 * Model of a slide deck
 *
 * Components of a slide deck :
 * - title : title of the lecture
 * - author : author of the lecture
 * - pdfPath : where the PDF file is stored
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LecturemodelSchema = new Schema({
  title: String,
  author: String,
  pdfPath: String
});

module.exports = mongoose.model('Lecturemodel', LecturemodelSchema);