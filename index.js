var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var players = [];
var turn = 0;



app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	console.log('A user ' + socket.id + ' has connected !');

	if (players.length == 0) {
		players.push({	
			id: socket.id,
		});
		io.emit('waiting', 'waiting for another player');
	} else if (players.length == 1) {
		players.push({
			id: socket.id,
		});
		io.clients[players[0].id].send({text: 'you can start', turn: true})

	} else {
		//kick the player
		socket.disconnect();
		console.log('the room is full');
	}

	console.log('current users = ' + io.sockets.clients((err, clients) => {
		if (err) console.log(err);
		console.log(clients);
	}));
	socket.on('disconnect', function() {
		console.log('User' + socket.id + ' has disconnected !');
	});
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});