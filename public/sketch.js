let board = []
let gs;
let myTurn;
let char;
let winner;
turnNum = 0;

let socket = io();

socket.on('waiting', msg => console.log(msg))

socket.on('start', msg => {
	console.log(msg.msg + " char = " + msg.char);
	myTurn = msg.turn;
	char = msg.char;
})

socket.on('turn', msg => {
	console.log(msg.i + " : " + msg.j);
	let index = msg.i + msg.j * 3;
	board[index].char = char == "X" ? 'O' : 'X';
	myTurn = !myTurn;
	turnNum = msg.n;
	console.log(msg.i, msg.j, turnNum)
})

function setup() {
	// put setup code here
	createCanvas(600, 600);
	gs = width / 3;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			board.push({
				i: i,
				j: j,
				char: ''
			})
		}
	}
}

function draw() {
	// put drawing code here
	background(51);
	for (let i = 1; i < 3; i++) {
		line(0, gs * i, width, gs * i);
		line(gs * i, 0, gs * i, height);
	}

	for (let b of board) {
		push();
		translate(gs * (b.j + 0.5), gs * (b.i + 0.65));
		textAlign(CENTER);
		textSize(100);
		text(b.char, 0, 0);
		pop();
	}
}

function mousePressed() {
	if ((mouseX <= width) && (mouseY <= height) && myTurn) {
		let i = parseInt(mouseX / gs);
		let j = parseInt(mouseY / gs);
		update(i, j);
	}
}


function update(i, j) {
	let index = i + j * 3;
	if (board[index].char == "") {
		turnNum++;
		console.log(i, j, turnNum)
		socket.emit('turn', {
			n: turnNum,
			i: i,
			j: j
		})
	}
	board[index].char = char == 'X' ? 'X' : 'O';
	myTurn = !myTurn;
	if(checkWinner()) {console.log('WINNER WINNER CHIKEN WINNER FOR PLAYER ' + winner)}
}

	
function checkWinner() {
	return winnerQ(0, 1, 2) ||
		winnerQ(3, 4, 5) ||
		winnerQ(6, 7, 8) ||
		winnerQ(0, 3, 6) ||
		winnerQ(1, 4, 7) ||
		winnerQ(2, 5, 8) ||
		winnerQ(0, 4, 8) ||
		winnerQ(6, 4, 2) ||
		stalemateQ();
}

function winnerQ(p1, p2, p3) {
	var c1 = board[p1].char;
	if (c1 == '') return false;
	var c2 = board[p2].char;
	if (c1 != c2) return false;
	var c3 = board[p3].char;
	if (c1 != c3) return false;
	winner = c1;
	return true;
}

function stalemateQ() {
	for (var i = 0; i < 9; i++) {
		if (board[i].char == '') return false;
	}
	winner = "C";
	return true;
}