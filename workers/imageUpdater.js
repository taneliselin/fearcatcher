var exec = require('child_process').exec;
var updater = null;

exports.start = function(imagePath, updateFrequency){
  updater = setInterval(function(){
    exec('fswebcam -r 640x480 --jpeg 85 '+imagePath, function(err, stdout, stderr) {
      if(err){
        console.log('Error getting image: '+err);
      }
    });
  }, updateFrequency);
};

exports.stop = function(){
  clearInterval(updater);
};