/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

var multipart = require('connect-multiparty');

var fs = require('fs');

//configuration of connect-multiparty
var pdfUploadDir = './public/data';
var options = new Object();
options.uploadDir = pdfUploadDir;
options.autoFiles = true;
var multipartMiddleware = multipart(options);

module.exports = function(app) {

  // Insert routes below
  app.use('/api/lectureModels', require('./api/lectureModel'));
  app.use('/api/lectures', require('./api/lecture'));
  app.use('/api/chats', require('./api/chat'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
    
    
  //handle pdf upload with connect-multiparty
  app.post('/upload', multipartMiddleware, function(req, resp)
  {
      console.log(req.body, req.files);
      //renaming the temporary file to with the original name
      fs.rename('./' + req.files.file.path, pdfUploadDir + "/" + req.files.file.originalFilename, function (err) {
          if (err) throw err;
          console.log('renaming complete into : ' + pdfUploadDir + "/"  + req.files.file.originalFilename);
      });
      
      //insert lecture model into database      
      var LectureModel = require('./api/lectureModel/lectureModel.model');
      LectureModel.create({
            title: req.body.title,
            author: req.body.author,
            pdfPath: 'data/' + req.files.file.originalFilename
        }, function() {
            console.log('finished db insertion of lecture model');
        }
      );
  });
};
