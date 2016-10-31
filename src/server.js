// 設定ファイルの読み込み

var config = require('config');
var port = config.port;


// サーバーの設定

var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', function(req, res){
    res.sendfile('public/index.html');
});

app.use(express.static('public'));

server.listen(port, function(){
  console.log('listening on : ' + port);
});
