var events = require('events');
var exec = require('child_process').exec;
var fs = require('fs');

var AudioRecorder = function (config) {
  var _this = this;
  _this.audioPath = config.audioPath;
  _this.audioDelay = config.audioDelay;
  _this.rec = function (callback) {
    exec('arecord -d '+_this.audioDelay+' '+_this.audioPath, function(err, stdout, stderr){
      if(err){
        callback(err);
      }else{
        callback(null, _this.audioPath);
      }
    });
  }
};

AudioRecorder.prototype = new events.EventEmitter;
AudioRecorder.prototype.rec = function () {
  this.start();
};

module.exports = AudioRecorder;

