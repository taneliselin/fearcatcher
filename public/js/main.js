(function(){
  'use strict';
  var socket = io();
  
  socket.on('face:analyzed', function(data){
    $('#anger').text(data.anger);
    $('#contempt').text(data.contempt);
    $('#disgust').text(data.disgust);
    $('#fear').text(data.fear);
    $('#happiness').text(data.happiness);
    $('#neutral').text(data.neutral);
    $('#sadness').text(data.sadness);
    $('#surprise').text(data.surprise);
  });
  
  
})();