const fs = require('fs');
const express = require('express');

var app = require('express')();
var io = require('socket.io')(http);
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//Static
app.get('/', function(req, res){
  res.sendFile(__dirname+'/public/static/index.html');
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});