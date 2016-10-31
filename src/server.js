var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', function(req, res){
    res.sendfile('public/index.html');
});

app.use(express.static('public'));

server.listen(30001, function(){
  console.log('listening on : 30001');
});
