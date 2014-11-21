/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'student1',
    role: 'student',
    email: 's1@s1.com',
    password: 'pass'
  }, {
    provider: 'local',
    name: 'student2',
    role: 'student',
    email: 's2@s2.com',
    password: 'pass'
  }, {
    provider: 'local',
    name: 'teacher1',
    role: 'teacher',
    email: 't1@t1.com',
    password: 'pass'
  }, function() {
      console.log('finished populating users');
    }
  );
});