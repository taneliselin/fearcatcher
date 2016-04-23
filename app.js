var express = require('express');
var app = express();

var http = require('http').Server(app);
http.liste(3000, function(){
  console.log('server listening on port 3000');
});