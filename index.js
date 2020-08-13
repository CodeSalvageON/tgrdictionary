const fs = require('fs');
const { JSDOM } = require('jsdom');
const express = require('express');
const createDOMPurify = require('dompurify');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

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
    <a href="https://tgrdictionary.codesalvageon.repl.co/definitions"><h2>Definitions</h2></a>
`;
const dictionary_footer = `
  </body>
</html>
`;

var def_list = ``;
var words;

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
      var cleaned_file_name = DOMPurify.sanitize(repaired_file_name);

      var linked_file = file.replace("public", "");

      def_list = def_list + `<a href="https://tgrdictionary.codesalvageon.repl.co/dictionary/`+linked_file+`"><h2>`+cleaned_file_name+`</h2></a>`;
      console.log(def_list);
    });
  });

  res.send(dictionary_head+def_list+dictionary_footer);
  def_list = '';
});

//POST requests
app.post('/create_word', function(req, res){
  const word_name = req.body.word;
  const definition_name = req.body.definition;

  const word_dir = __dirname+'/public/dictionary/'+word_name.toLowerCase()+'.html';

  if (fs.existsSync(word_dir)){
    fs.appendFileSync(word_dir, `
<h1>`+word_name+`</h1>
<h3>`+definition_name+`</h3>
  `);
  }
  else{
    fs.appendFileSync(word_dir, dictionary_head+`
<h1>`+word_name+`</h1>
<h3>`+definition_name+`</h3>
  `+dictionary_footer);
  }

  res.redirect('/dictionary');
});