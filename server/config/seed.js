/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var UserFriendlyIdCounter = require('../api/lecture/userFriendlyIdCounter.model');
var Lecture = require('../api/lecture/lecture.model');

// Three users by default : two students and one teacher
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

Lecture.find({}).remove();

//the counter used for lectures
UserFriendlyIdCounter.find({}).remove(function() {
  UserFriendlyIdCounter.create({
    id: '1',
    countValue: '1'
  }, function() {
      console.log('finished populating counters');
    }
  );
});
