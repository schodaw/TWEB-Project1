/*
 * Model of a lecture currently given by a teacher
 *
 * Components of a lecture :
 * - title : title of the lecture
 * - author : author of the lecture
 * - pdfPath : where the PDF file is stored
 * - currentPage : number of the current page
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LectureSchema = new Schema({
  title: String,
  author: String,
  pdfPath: String,
  currentPage: Number,
  userFriendlyId : Number
});

module.exports = mongoose.model('Lecture', LectureSchema);