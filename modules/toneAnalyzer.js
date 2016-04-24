var events = require('events');
var watson = require('watson-developer-cloud');
var fs = require('fs');

var ToneAnalyzer = function (config) {
  var _this = this;
  _this.tone_analyzer = watson.tone_analyzer({
    username: config.watsonTaUser,
    password: config.watsonTaPw,
    version: 'v3-beta',
    version_date: '2016-02-11'
  });
  _this.analyze = function (text, callback) {
    _this.tone_analyzer.tone({ text: text }, function (err, tone) {
      callback(err, tone);
    });
  }
};

ToneAnalyzer.prototype = new events.EventEmitter;
ToneAnalyzer.prototype.analyze = function (text, callback) {
  this.analyze(text, callback);
};

module.exports = ToneAnalyzer;

