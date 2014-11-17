'use strict';

var _ = require('lodash');
var Lecturemodel = require('./lectureModel.model');

// Get list of lectureModels
exports.index = function(req, res) {
  Lecturemodel.find(function (err, lectureModels) {
    if(err) { return handleError(res, err); }
    return res.json(200, lectureModels);
  });
};

// Get a single lectureModel
exports.show = function(req, res) {
  Lecturemodel.findById(req.params.id, function (err, lectureModel) {
    if(err) { return handleError(res, err); }
    if(!lectureModel) { return res.send(404); }
    return res.json(lectureModel);
  });
};

// Creates a new lectureModel in the DB.
exports.create = function(req, res) {
  Lecturemodel.create(req.body, function(err, lectureModel) {
    if(err) { return handleError(res, err); }
    return res.json(201, lectureModel);
  });
};

// Updates an existing lectureModel in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Lecturemodel.findById(req.params.id, function (err, lectureModel) {
    if (err) { return handleError(res, err); }
    if(!lectureModel) { return res.send(404); }
    var updated = _.merge(lectureModel, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, lectureModel);
    });
  });
};

// Deletes a lectureModel from the DB.
exports.destroy = function(req, res) {
  Lecturemodel.findById(req.params.id, function (err, lectureModel) {
    if(err) { return handleError(res, err); }
    if(!lectureModel) { return res.send(404); }
    lectureModel.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}