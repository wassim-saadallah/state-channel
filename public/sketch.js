let board = []
let gs;
var turn = false;

let socket = io();

socket.on('waiting', function(msg){
	console.log(msg)
});

socket.on('message', function(msg){
	console.log(msg)
});

socket.on('ready', msg => console.log(msg))

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
	let i = parseInt(mouseX / gs);
	let j = parseInt(mouseY / gs);

	updateBoard(i, j)
}


function updateBoard(i, j) {
	let index = i + j * 3;
	if (board[index].char == "") {
		board[index].char = turn ? 'X' : 'O';
		turn = !turn;
	}
}
