pragma solidity ^0.5.0;

contract SimpleStorage{
    // transfer a given amount of wei from sender to smart contract
    function sendWei() payable public {}

    // transfer the whole smart contract's account balance to the sender
    function getBack() public{
        msg.sender.transfer(address(this).balance);
    }

    // return the smart contract's account balance
    function getContractBalance() public view returns(uint){
        return address(this).balance;
    }
}