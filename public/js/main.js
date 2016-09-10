(function () {
  'use strict';
  var socket = io();

  var max_data_points = 20;
  var current_time = new Date().getTime();

  var face_anger = [[current_time, 0]];
  var face_contempt = [[current_time, 0]];
  var face_disgust = [[current_time, 0]];
  var face_fear = [[current_time, 0]];
  var face_happiness = [[current_time, 0]];
  var face_neutral = [[current_time, 0]];
  var face_sadness = [[current_time, 0]];
  var face_surprise = [[current_time, 0]];

  var tone_anger = [[current_time, 0]];
  var tone_disgust = [[current_time, 0]];
  var tone_fear = [[current_time, 0]];
  var tone_joy = [[current_time, 0]];
  var tone_sadness = [[current_time, 0]];

  var face_data = [
    { data: face_anger, label: 'anger' },
    { data: face_contempt, label: 'contempt' },
    { data: face_disgust, label: 'disgust' },
    { data: face_fear, label: 'fear' },
    { data: face_happiness, label: 'happiness' },
    { data: face_neutral, label: 'neutral' },
    { data: face_sadness, label: 'sadness' },
    { data: face_surprise, label: 'surprise' }
  ];
  var tone_data = [
    { data: tone_anger, label: 'anger' },
    { data: tone_disgust, label: 'disgust' },
    { data: tone_fear, label: 'fear' },
    { data: tone_joy, label: 'joy' },
    { data: tone_sadness, label: 'sadness' }
  ];

  var face_plot = $.plot($('#face-container'), face_data, {
    xaxis: { mode: 'time', show: false },
    yaxis: {show: false}
  });
  var tone_plot = $.plot($('#tone-container'), tone_data, {
    xaxis: { mode: 'time', show: false },
    yaxis: {show: false}
  });

  socket.on('face:analyzed', function (data) {
    var new_time = new Date().getTime();
    if (face_anger.length > max_data_points) {
      face_anger.shift();
      face_contempt.shift();
      face_disgust.shift();
      face_fear.shift();
      face_happiness.shift();
      face_neutral.shift();
      face_sadness.shift();
      face_surprise.shift();
    }
    face_anger.push([new_time, data.anger]);
    face_contempt.push([new_time, data.contempt]);
    face_disgust.push([new_time, data.disgust]);
    face_fear.push([new_time, data.fear]);
    face_happiness.push([new_time, data.happiness]);
    face_neutral.push([new_time, data.neutral]);
    face_sadness.push([new_time, data.sadness]);
    face_surprise.push([new_time, data.surprise]);
    var new_data = [
      { data: face_anger, label: 'anger' },
      { data: face_contempt, label: 'contempt' },
      { data: face_disgust, label: 'disgust' },
      { data: face_fear, label: 'fear' },
      { data: face_happiness, label: 'happiness' },
      { data: face_neutral, label: 'neutral' },
      { data: face_sadness, label: 'sadness' },
      { data: face_surprise, label: 'surprise' }
    ];
    face_plot.setData(new_data);
    face_plot.setupGrid();
    face_plot.draw();
  });

  socket.on('tone:analyzed', function (data) {
    var new_time = new Date().getTime();
    if (tone_anger.length > max_data_points) {
      tone_anger.shift();
      tone_disgust.shift();
      tone_fear.shift();
      tone_joy.shift();
      tone_sadness.shift();
    }
    tone_anger.push([new_time, data.anger]);
    tone_disgust.push([new_time, data.disgust]);
    tone_fear.push([new_time, data.fear]);
    tone_joy.push([new_time, data.joy]);
    tone_sadness.push([new_time, data.sadness]);
    var new_data = [
      { data: tone_anger, label: 'anger' },
      { data: tone_disgust, label: 'disgust' },
      { data: tone_fear, label: 'fear' },
      { data: tone_joy, label: 'joy' },
      { data: tone_sadness, label: 'sadness' }
    ];
    tone_plot.setData(new_data);
    tone_plot.setupGrid();
    tone_plot.draw();
  });
  
  socket.on('alert', function(data){
    noty({
      text: data.msg,
      type: 'information',
      layout: 'top',
      timeout: 10000
    });
  });
  
  socket.on('praise', function(data){
    noty({
      text: data.msg,
      type: 'success',
      layout: 'top',
      timeout: 10000
    });
  });

  socket.on('moodmetric:data', function(data){
    $('.mmValue').text(data.mm);
    $('.instantValue').text(data.instant);
  });

  socket.on('moodmetric:warning:mm:ended', function(data){
    noty({
      text: 'elevated MM dropped',
      type: 'success',
      layout: 'top',
      timeout: 10000
    });
  });

  socket.on('moodmetric:warning:mm:started', function(data){
    noty({
      text: 'elevated MM warning',
      type: 'information',
      layout: 'top',
      timeout: 10000
    });
  });

  socket.on('moodmetric:reaction', function(data){
    noty({
      text: 'Strong reaction detected',
      type: 'information',
      layout: 'top',
      timeout: 10000
    });
  });

  socket.on('moodmetric:ring:removed', function(){
    noty({
      text: 'Ring was removed from finger',
      type: 'error',
      layout: 'top',
      timeout: 10000
    });
  });

  socket.on('moodmetric:battery', function(){
    noty({
      text: 'Ring battery is empty',
      type: 'error',
      layout: 'top',
      timeout: 10000
    });
  });

  socket.on('moodmetric:ring:inserted', function(){
    noty({
      text: 'Ring was inserted to finger',
      type: 'success',
      layout: 'top',
      timeout: 10000
    });
  });
  
})();