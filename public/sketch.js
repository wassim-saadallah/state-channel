let web3;
let account;
let otherAccount;
let waiting = false;

let board = []
let gs;
let myTurn;
let winner;
let turnNum = 0;
let socket;
let mySignedStates = [];
let hisSignedStates = [];
let signedMove;

function preload() {

	//connect to node
	console.log('establishing connection with ethereum node...')
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

	//get account address and unlock it
	account = new URL(window.location.href).searchParams.get('a');

	//unlocking account
	console.log('unlocking account...')
	let unlocked = web3.personal.unlockAccount(account, "wassim", 0)
	if(unlocked) console.log('unlocked');	
	else console.log('error unlocking the accounts');


	//connect to socketIO server
	console.log('establishing connection with socket server...');

	socket = io();

	socket.on('waiting', msg => {
		console.log(msg);
		waiting = true;
		//send transaction to open state channel
		statechannelInstance.openChannel.call({
			from: account
		}, function(err, res) {
			if (err) console.log(err)
			if (res && !err) {
				console.log('I opened the channel and my address being : ' + res)
			}
		})
	})

	socket.on('start', msg => {
		console.log('the game has started ' + msg.msg + " char = " + msg.char);
		myTurn = msg.turn;
		char = msg.char;
		socket.emit('address', account);
	})

	socket.on('address', pem => {
		console.log('recieved address \n' + pem);
		otherAccount = pem;
		if (!waiting) {
			//send transaction to join the channel
			statechannelInstance.joinChannel.call({
				from: account
			}, function(err, res) {
				if (err) console.log(err)
				if (res && !err) {
					console.log('I joined the channel with my address being : ' + res)
				}
			})
		}
	})

	socket.on('turn', msg => {

		console.log('trying to verify the signed message ...');
		console.log(msg);

		if (verified(msg)) {
			console.log(hisSignedStates);
			let b = msg.m.split('');
			for (let i = 0; i < 9; i++) {
				console.log(b[i]);
				board[i].char = b[i] == "_" ? "" : b[i];
			}
			myTurn = !myTurn;
			turnNum = parseInt(b[9]);
			signedMove = sign(turnNum);
			mySignedStates.push(signedMove);
			if (msg.sm)
				hisSignedStates.push(msg.sm);
			hisSignedStates.push({
				message: msg.m,
				signature: msg.s
			})
		}

		if (checkWinner()) {
			console.log('WINNER WINNER CHIKEN WINNER FOR PLAYER ' + winner);
			if (mySignedStates.length == hisSignedStates.length) {
				//send transaction to close the state channel
				var l = mySignedStates.length - 1
				let a1 = mySignedStates[l].signature;
				let a2 = hisSignedStates[l].signature;

				let sha = web3.sha3(mySignedStates[l].message)

				let r1 = '0x' + a1.substring(2, 66);
				let s1 = '0x' + a1.substring(66, 130);
				let v1 = web3.toDecimal('0x' + a1.substring(130, 132));

				let r2 = '0x' + a2.substring(2, 66);
				let s2 = '0x' + a2.substring(66, 130);
				let v2 = web3.toDecimal('0x' + a2.substring(130, 132));


				console.log(`"${sha}", "${r1}", "${s1}", ${v1}, "${r2}", "${s2}", ${v2}`)

				//send the last state to the other player
				socket.emit('last-move', mySignedStates[mySignedStates.length - 1])

				statechannelInstance.closeChannel.call(
					sha, r1, s1, v1, r2, s2, v2, {
						from: account
					},
					function(err, res) {
						if (err) console.log(err)
						if (res && !err) {
							console.log('Channel has been closed with the final state' + res)
						}
					})

			}
		}
	})

	socket.on('last-move', msg => {
		hisSignedStates.push(msg)
	})
}

function verified(msg) {
	//TODO : add verification
	let cond = false;
	let sha = web3.sha3(msg.m);
	console.log(sha, msg.s)
	return web3.personal.ecRecover(sha, msg.s) == otherAccount;
}


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

function encode_board() {
	return board.map(s => s.char != "" ? s.char : "_").join("");
}


function sign(turnNum) {
	let message = encode_board() + turnNum;
	let hashedMessage = web3.sha3(message);
	let signature = web3.eth.sign(account, hashedMessage);
	return {
		message,
		signature
	}
}

function update(i, j) {
	let index = i + j * 3;
	if (board[index].char == "") {
		board[index].char = char == 'X' ? 'X' : 'O';
		turnNum++;
		console.log(i, j, turnNum)

		let {
			message,
			signature
		} = sign(turnNum);
		mySignedStates.push({
			message,
			signature
		})
		socket.emit('turn', {
			m: message,
			s: signature,
			sm: signedMove
		})
	}

	myTurn = !myTurn;
	if (checkWinner()) {
		console.log('WINNER WINNER CHIKEN WINNER FOR PLAYER ' + winner);
	}
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