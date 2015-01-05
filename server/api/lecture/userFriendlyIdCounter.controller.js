'use strict';

var _ = require('lodash');

var UserFriendlyIdCounter = require('./userFriendlyIdCounter.model');

// Return the counter value and increment it
exports.increment = function(req, res, callback) {
  UserFriendlyIdCounter.find({ id: 1 }, function (err, userFriendlyIdCounter) {
    if(err) { return handleError(res, err); }
    if(!userFriendlyIdCounter) { return res.send(404); }
    var result = userFriendlyIdCounter[0].countValue;
    
    //update counter
    //use mongodb transaction ("obsert") to prevent conccurency problems
    userFriendlyIdCounter[0].countValue = result + 1;  
    var userFriendlyIdCounter = _.merge(userFriendlyIdCounter[0], userFriendlyIdCounter[0]);
    userFriendlyIdCounter.save(function (err) {
      if (err) { return handleError(res, err); }
    });
    
    callback(result);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}