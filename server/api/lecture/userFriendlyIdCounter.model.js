/*
 * A counter used to generate user friendly unique id.
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserFriendlyIdCounterSchema = new Schema({
  id: Number,
  countValue: Number
});

module.exports = mongoose.model('UserFriendlyIdCounter', UserFriendlyIdCounterSchema);