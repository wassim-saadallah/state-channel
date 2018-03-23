var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var players = [];
var turnNumber = 0;



app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


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
		console.log("recieved " + msg + "from " + socket.id);
		for (var i = 0; i < players.length; i++) {
			if (players[i].id == socket.id && turnNumber == msg.n - 1) {
				console.log("emitting to " + players[1 - i].id)
				io.sockets.connected[players[1 - i].id].emit('turn', {
					i: msg.i,
					j: msg.j,
					n: msg.n
				});
				turnNumber = msg.n;
			}
		}
	});


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

http.listen(3000, function() {
	console.log('listening on *:3000');
});