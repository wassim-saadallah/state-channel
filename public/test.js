web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));




var coinbase = web3.eth.coinbase;
var balance = web3.eth.getBalance(coinbase);


console.log(web3.personal.unlockAccount(coinbase, ""));