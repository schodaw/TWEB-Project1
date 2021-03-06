'use strict';

var express = require('express');
var controller = require('./lecture.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
//get the chat messages of a lecture
router.get('/:id/chats', controller.showChat);
//get a lecture by it's UserFriendlyId
router.get('/byUserFriendlyId/:id', controller.getByUserfriendlyId);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;