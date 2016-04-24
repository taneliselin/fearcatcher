var express = require('express');
var path = require('path');
var connect = require('camo').connect;
var Measurement = require('./model/measurement');
var config = require('./config.js');
var ImageUpdater = require('./modules/imageUpdater');
var ImageAnalyzer = require('./modules/imageAnalyzer');
var AudioRecorder = require('./modules/audioRecorder');
var AudioAnalyzer = require('./modules/audioAnalyzer');
var imageUpdater = new ImageUpdater(config);
var imageAnalyzer = new ImageAnalyzer(config);
var audioRecorder = new AudioRecorder(config);
var audioAnalyzer = new AudioAnalyzer(config);
var app = express();
var database = 'nedb://./data';
var currentScore = 0;

imageUpdater.start();
audioRecorder.start();

connect(database).then(function (db) {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
  
  var http = require('http').Server(app);
  var io = require('socket.io')(http);

  imageUpdater.on('imageUpdated', function(image){
    imageAnalyzer.analyze(image, function(err, result){
      if(err){
        console.log(err);
      }else{
        if(result.length > 0){
          var face = result[0];
          if(typeof face.scores !== 'undefined'){
            var measurement = Measurement.create(face.scores);
            measurement.save().then(function(m){
              io.emit('face:analyzed', m);
            });
          }
        }else{
          console.log('no faces found');
        }
      }
    });
  });
  
  audioRecorder.on('audioRecorded', function(audio){
    audioAnalyzer.analyze(audio, function(err, transcript){
      if(transcript.results.length > 0){
        var fullText = '';
        for(var i = 0; i < transcript.results.length;i++){
          var currentRecord = transcript.results[i];
          fullText += currentRecord.alternatives[0].transcript;
        }
        console.log(transcript);
      }
    });
  });

  app.get('/', function (req, res) {
    res.render('index');
  });

  http.listen(config.port, function () {
    console.log('Express server listening on port 3000');
  });
});