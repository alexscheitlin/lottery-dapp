pragma solidity ^0.5.0;

import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";


// Again does not work with Ganache and remix IDE! Only on any of the official testnets such as Ropsten.
contract RandomNumberOraclize is usingOraclize {

    uint public randomNumber;

    event LogNewOraclizeQuery(string description);
    event LogNewRandomNumber(uint price);

    constructor () public payable{
    }
    
    // The oracle callback takes a few moments to update the random number (upto 1min)
    function __callback(bytes32 myid, string memory result, bytes memory proof) public {
        require(msg.sender == oraclize_cbAddress());
        randomNumber = parseInt(result);
        emit LogNewRandomNumber(randomNumber);
    }
    
    function update() public payable{
        if (oraclize_getPrice("WolframAlpha") > address(this).balance) {
            emit LogNewOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee!");
        } else {
            emit LogNewOraclizeQuery("Oraclize query was sent, standing by for the answer...");
            oraclize_query("WolframAlpha", "random number between 0 and 43");
        }
    }
}