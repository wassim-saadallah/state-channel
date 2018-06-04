var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var players = [];



app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', function(req, res) {
	res.sendFile(__dirname + '/public/login.html');
});

io.on('connection', function(socket) {
	console.log('A user ' + socket.id + ' has connected !');
	if (players.length == 0) {
		players.push({
			id: socket.id,
		});
		io.emit('waiting', 'waiting for another player');
		console.log('current players : ' + players.slice(0, players.length).map(p => p.id))
	} else if (players.length == 1) {
		players.push({
			id: socket.id,
		});
		io.sockets.connected[players[0].id].emit('start', {
			msg: 'You start',
			turn: true,
			char: 'X'
		});
		io.sockets.connected[players[1].id].emit('start', {
			msg: 'Player 1 starts',
			turn: false,
			char: "O"
		});
		console.log('current players : ' + players.slice(0, players.length).map(p => p.id))
	} else {
		//kick the player
		socket.disconnect();
		console.log('the room is full');
	}


	socket.on('turn', msg => {
		console.log("recieved turn from" + socket.id);
		for (var i = 0; i < players.length; i++) {
			if (players[i].id == socket.id) {
				console.log("emitting that turn to " + players[1 - i].id)
				io.sockets.connected[players[1 - i].id].emit('turn', msg);
			}
		}
	});


	socket.on('address', msg => {
		console.log("recieved address from" + socket.id);
		for (var i = 0; i < players.length; i++) {
			if (players[i].id == socket.id) {
				console.log("emitting address to " + players[1 - i].id)
				io.sockets.connected[players[1 - i].id].emit('address', msg);
			}
		}
	})


	socket.on('last-move', msg => {
		console.log("recieved address from" + socket.id);
		for (var i = 0; i < players.length; i++) {
			if (players[i].id == socket.id) {
				console.log("emitting last move to " + players[1 - i].id)
				io.sockets.connected[players[1 - i].id].emit('last-move', msg);
			}
		}
	})


	socket.on('disconnect', function() {
		console.log('User ' + socket.id + ' has disconnected !');
		for (var i = 0; i < players.length; i++) {
			if (players[i].id == socket.id) {
				players.splice(i, 1);
				console.log('current players : ' + players.slice(0, players.length).map(p => p.id))
			}
		}
	});
});

http.listen(4000, function() {
	console.log('listening on *:4000');
});