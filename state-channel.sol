//http://remix.ethereum.org/#optimize=false&version=soljson-v0.4.22+commit.4cb486ee.js

pragma solidity ^0.4.0;

contract StateChannel {
    
    enum State{
        PENDING,
        OPENED,
        CLOSING,
        CLOSED,
        DISPUTING,
        CHALLENGED
    }
    
    

    address public player1;
    address public player2;
    bytes32 public finalState;
    address public a1;
    address public a2;
    State public state;
    
    
    event channelOpened (address player, address otherPlayer);
    event channelClosed (address player, address otherPlayer, bytes32 lastState);
    event dispute (address player, address otherPlayer, bytes32 lastState);
    event challenge (address player, address otherPlayer, bytes32 lastState);
    
    
    
    function openChannel() public returns(address){
        player1 = msg.sender;
        //state = State.PENDING;
        return player1;
    }

    
    
    function joinChannel() public returns(address) {
        if(state != State.PENDING) revert('bad state');
        if(msg.sender == player1) revert('do not open a state channel with yourself');
        player2 = msg.sender;
        state = State.OPENED;
        emit channelOpened(player1, player2);
        return player2;
    }
    
    function closeChannel(bytes32 latestStateHash, bytes32 _r1, bytes32 _s1, uint8 _v1, bytes32 _r2, bytes32 _s2, uint8 _v2) public returns (bytes32){
        /*if(msg.sender != player1 || msg.sender != player2){
            revert();
        }
        if(state != State.OPENED){
            revert();
        }*/
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(prefix, latestStateHash);
        a1 = ecrecover(prefixedHash, _v1, _r1, _s1);
        a2 = ecrecover(prefixedHash, _v2, _r2, _s2);
        if(a1 != player1 || a2 != player2){
            if(a1 != player2 || a2 != player1){
                revert();
            }
        }
        finalState = latestStateHash;
        emit channelClosed(player1, player2, finalState);
        return finalState;
    }
}