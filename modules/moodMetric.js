var noble = require('noble');
var conf = require('../config');
var currentStatus = [ 0, 1, 0, 0, 0, 0, 0, 0 ];
var IO = null;

module.exports = function(io){
  IO = io;

  noble.on('stateChange', function (state) {
    console.log('state: ' + state);
    if (state === 'poweredOn') {
      noble.startScanning();
    } else {
      noble.stopScanning();
    }
  });

  noble.on('discover', function (peripheral) {
    if (peripheral.id == conf.moodmetric.mmId) {
      noble.stopScanning();

      explore(peripheral);
    } else {
      var advertisement = peripheral.advertisement;
      var localName = advertisement.localName;
      console.log('Discovered peripheral with id: ' + peripheral.id + ' (' + localName + ') but was looking for: ' + conf.mmId);
    }
  });
}

function explore(peripheral) {
  peripheral.connect(function (err) {
    if (err) {
      console.log(err);
      peripheral.disconnect();
      setTimeout(function () {
        explore(peripheral);
      }, 1000);
    } else {
      console.log('Connected to Moodmetric ring');
      peripheral.discoverServices([conf.moodmetric.mmServiceUuid], function (error, services) {
        var service = services[0];
        service.discoverCharacteristics([conf.moodmetric.mmStreamCharacteristicUuid, conf.moodmetric.mmNotificationCharacteristicUuid], function (error, characteristics) {
          var recognizedCharacteristic = false;
          for (var i = 0; i < characteristics.length; i++) {
            var characteristic = characteristics[i];
            recognizedCharacteristic = false;
            if (characteristic.uuid == conf.moodmetric.mmStreamCharacteristicUuid) {
              console.log('subscribing to Moodmetric stream...');
              characteristic.on('data', streamCallback);
              recognizedCharacteristic = true;
            } else if (characteristic.uuid == conf.moodmetric.mmNotificationCharacteristicUuid) {
              console.log('subscribing to Moodmetric notifications...');
              characteristic.on('data', notificationCallback);
              recognizedCharacteristic = true;
            }
            if (recognizedCharacteristic) {
              characteristic.subscribe(function (err) {
                if (err) console.log(err);
              });
            }
          }
        });
      });
    }
  });
}

function streamCallback(data, isNotification) {
  var packetOk = data[0] & (1 << 0) ? false : true;
  if(packetOk) {
    var mm = data[1] & 0xff;
    var instant = ((data[2] & 0xff) << 8) | (data[3] & 0xff);
    IO.emit('moodmetric:data', {mm: mm, instant: instant});
  } else {
    console.log('Ring was not ready or there was bad skin contact');
  }
}

function notificationCallback(data, isNotification) {
  console.log('notification received');
  var statusBits = [];
  for (var i = 0; i <= 7; i++) {
    var bit = data[0] & (1 << i) ? 1 : 0;
    statusBits.push(bit);
    switch(i) {
      case 1:
        if(currentStatus[1] > bit) {
          IO.emit('moodmetric:ring:removed');
          console.log('Ring removed from finger');
        } else if(currentStatus[1] < bit) {
          IO.emit('moodmetric:ring:inserted');
          console.log('Ring was inserted to finger');
        }
        break;
      case 2:
        if(bit > 0) {
          IO.emit('moodmetric:battery');
          console.log('Battery is low');
        }
        break;
      case 4:
        if(bit > 0) {
          IO.emit('moodmetric:reaction');
          console.log('Strong reaction detected');
        }
        break;
      case 5:
        if(currentStatus[5] > bit) {
          IO.emit('moodmetric:warning:mm:ended');
          console.log('Elevated MM dropped');
        } else if(currentStatus[5] < bit) {
          IO.emit('moodmetric:warning:mm:started');
          console.log('Elevated MM warning');
        }
        break;
      default:
        break;

    }
  }
  currentStatus = statusBits;
}