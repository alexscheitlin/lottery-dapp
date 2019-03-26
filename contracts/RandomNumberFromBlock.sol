pragma solidity ^0.5.0;

// Set Automine in Ganache to false. Otherwise no new block is added and the same random number is generated.
contract RandomNumberFromBlock{
    function getRandomNumber() public view returns(uint){
        return (uint(blockhash(block.number-1)) % 42) + 1;
    }
}