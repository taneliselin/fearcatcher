var events = require('events');
var exec = require('child_process').exec;
var fs = require('fs');

var AudioRecorder = function (config) {
  var _this = this;
  _this.audioPath = config.audioPath;
  _this.audioDelay = config.audioDelay;
  _this.start = function () {
    _this.recorder = setInterval(function () {
      exec('arecord -r 44100 -d ' + _this.audioDelay + ' ' + _this.audioPath, function (err, stdout, stderr) {
        if (err) {
          console.log('Error recording audio');
        } else {
          _this.emit('audioRecorded', _this.audioPath);
        }
      });
    }, (_this.audioDelay * 1000) + 500);
  }
  _this.stop = function(){
    clearInterval(_this.recorder);
  }
};

AudioRecorder.prototype = new events.EventEmitter;
AudioRecorder.prototype.start = function () {
  this.start();
};
AudioRecorder.prototype.stop = function () {
  this.stop();
};

module.exports = AudioRecorder;

