var express = require('express');
var path = require('path');
var connect = require('camo').connect;
var Measurement = require('./model/measurement');
var config = require('./config.js');
var ImageUpdater = require('./modules/imageUpdater');
var imageUpdater = new ImageUpdater(config);
var app = express();
var database = 'nedb://./data';
var currentScore = 0;

imageUpdater.start();

connect(database).then(function (db) {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
  
  var http = require('http').Server(app);
  var io = require('socket.io')(http); //TODO: set up websockets since we will surely need them later

  imageUpdater.on('imageUpdated', function(image){
    console.log('Image updated: '+image);
  });

  app.get('/', function (req, res) {
    res.render('index');
  });

  http.listen(config.port, function () {
    console.log('Express server listening on port 3000');
  });
});