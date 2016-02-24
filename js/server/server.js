var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile('main.html',{ root:'D:/OneDrive/SkripteWS2015/MME/Projekt/dunegon-hop'});
});

io.on('connection', function(socket){
    console.log('a player connected');

    socket.on('disconnect', function(){
        console.log('player disconnected');
    });
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});
