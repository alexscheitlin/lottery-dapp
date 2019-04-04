pragma solidity ^0.5.0;

contract RandomNumberOracle{
    function getRandomNumber(uint blockNumber) public view returns(uint){
        return (uint(blockhash(blockNumber)) % 42) + 1;
    }
    
    function getSixRandomNumbers(uint blockNumber) public view returns(uint[] memory _randomNumbers){
        _randomNumbers = new uint[](6);
        for(uint i = 0; i < 6; i++){
            _randomNumbers[i] = (uint(blockhash(blockNumber-i)) % 42) + 1;
        }
        return _randomNumbers;
    }
}

// This is just a dummy lottery SC to demonstrate how to interact with the Random Number Oracle
contract Lottery{
    RandomNumberOracle oracle;
    uint randomNumber;
    uint drawLotteryBlockNumber;
    
    constructor(address _oracleAddress) public{
        oracle = RandomNumberOracle(_oracleAddress);
        drawLotteryBlockNumber = block.number;
    }
    
    function setRandomNumber() public{
        randomNumber = oracle.getRandomNumber(drawLotteryBlockNumber);
    }
    
    function getRandomNumber() public view returns(uint){
        return randomNumber;
    }
}