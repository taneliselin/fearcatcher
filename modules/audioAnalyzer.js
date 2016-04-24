var events = require('events');
var watson = require('watson-developer-cloud');
var fs = require('fs');

var AudioRecorder = function (config) {
  var _this = this;
  _this.speech_to_text = watson.speech_to_text({
    username: config.watsonUser,
    password: config.watsonPw,
    version: 'v1'
  });
  _this.analyze = function (audioFile, callback) {
    _this.speech_to_text.recognize({
      audio: fs.createReadStream(audioFile),
      content_type: 'audio/wav'
    }, function (err, transcript) {
      callback(err, transcript);
    });
  }
};

AudioRecorder.prototype = new events.EventEmitter;
AudioRecorder.prototype.analyze = function (audio, callback) {
  this.analyze(audio, callback);
};

module.exports = AudioRecorder;

