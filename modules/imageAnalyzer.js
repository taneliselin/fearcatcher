var events = require('events');
var fs = require('fs');
var request = require('request');

var ImageAnalyzer = function (config) {
  var _this = this;
  _this.apiKey = config.apiKey;
  _this.analyze = function (image, callback) {
    fs.createReadStream(image).pipe(request.post({
      url: 'https://api.projectoxford.ai/emotion/v1.0/recognize',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': _this.apiKey
      }
    }, function(err, res, body){
      if(err){
        callback(err)
      }else if (res.statusCode !== 200) {
        callback('Returned statusCode: '+res.statusCode);
      }else{
        callback(null, JSON.parse(body));
      }
    }));
  }
};

ImageAnalyzer.prototype = new events.EventEmitter;
ImageAnalyzer.prototype.analyze = function (image) {
  this.analyze(image);
};
module.exports = ImageAnalyzer;