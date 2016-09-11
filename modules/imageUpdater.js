var exec = require('child_process').exec;
var events = require('events');

var ImageUpdater = function (config) {
  var _this = this;
  _this.imagePath = config.imagePath;
  _this.updateFrequency = config.updateFrequency;
  _this.start = function () {
    _this.updater = setInterval(function () {
      exec('fswebcam -r 1024x800 --jpeg 85 ' + _this.imagePath, function (err, stdout, stderr) {
        if (err) {
          console.log('Error getting image: ' + err);
        }else{
          _this.emit('imageUpdated', _this.imagePath);
        }
      });
    }, _this.updateFrequency);
  };
  _this.stop = function(){
    clearInterval(_this.updater);
  };
};

ImageUpdater.prototype = new events.EventEmitter;

ImageUpdater.prototype.start = function(){
  this.start();
}

ImageUpdater.prototype.stop = function(){
  this.stop();
};

module.exports = ImageUpdater;