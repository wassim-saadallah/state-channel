web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));




var statechannelContract = web3.eth.contract([
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "otherPlayer",
				"type": "address"
			}
		],
		"name": "channelOpened",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "otherPlayer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "lastState",
				"type": "bytes32"
			}
		],
		"name": "channelClosed",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "latestStateHash",
				"type": "bytes32"
			},
			{
				"name": "_r1",
				"type": "bytes32"
			},
			{
				"name": "_s1",
				"type": "bytes32"
			},
			{
				"name": "_v1",
				"type": "uint8"
			},
			{
				"name": "_r2",
				"type": "bytes32"
			},
			{
				"name": "_s2",
				"type": "bytes32"
			},
			{
				"name": "_v2",
				"type": "uint8"
			}
		],
		"name": "closeChannel",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "otherPlayer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "lastState",
				"type": "bytes32"
			}
		],
		"name": "dispute",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "otherPlayer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "lastState",
				"type": "bytes32"
			}
		],
		"name": "challenge",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "joinChannel",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "openChannel",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "a1",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "a2",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "finalState",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getPlayer1",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getPlayer2",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "player1",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "player2",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]);
statechannelInstance = statechannelContract.at("0xd5d6984105fae1ba18b9ecd5fb1544c1b9a6f461");

