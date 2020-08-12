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

//Setting Dictionary Directory
const dictionary_directory = __dirname+'/public/dictionary/';
const dictionary_head = `
<!DOCTYPE html>
<html>
  <head>
    <!-- Favicon -->
    <link rel="icon" href="https://vignette.wikia.nocookie.net/starwars/images/d/de/Republic_Emblem.svg/revision/latest/scale-to-width-down/340?cb=20080311202148" />

    <!-- Local CSS Files -->
    <link rel="stylesheet" href="https://tgrdictionary.codesalvageon.repl.co/styles/style.css" />

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Titillium+Web&display=swap" rel="stylesheet">
  </head>
  <body>
`;
const dictionary_footer = `
  </body>
</html>
`;

var def_list = ``;

//Static
app.get('/', function(req, res){
  res.sendFile(__dirname+'/public/static/index.html');
});

app.get('/dictionary', function(req, res){
  res.sendFile(__dirname+'/public/static/dictionary.html');
});

app.get('/write', function(req, res){
  res.sendFile(__dirname+'/public/static/write.html');
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

//Dictionary Definitions 
app.get('/definitions', function(req, res){
  fs.readdir(dictionary_directory, (err, files) => {
    if (err){
      throw err;
    }

    files.forEach(file => {
      var fixed_file_name = file.replace('public/dictionary/', "");
      var repaired_file_name = file.replace('.html', "");

      def_list = def_list + `<a href="https://tgrdictionary.codesalvageon.repl.co/`+file+`"><h2>`+repaired_file_name+`</h2></a>`;
      console.log(def_list);
    });
  });

  res.send(dictionary_head+def_list+dictionary_footer);
});