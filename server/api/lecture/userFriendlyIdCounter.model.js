/*
 * A counter used to generate user friendly unique id.
 * Components of a UserFriendlyIdCounter :
 * - id : used to differentiate each counter
 * - countValue : current value of the counter
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserFriendlyIdCounterSchema = new Schema({
  id: Number,
  countValue: Number
});

module.exports = mongoose.model('UserFriendlyIdCounter', UserFriendlyIdCounterSchema);