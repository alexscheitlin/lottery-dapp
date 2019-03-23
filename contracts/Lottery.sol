pragma solidity >=0.4.25 <0.6.0;

// IT DOES NOT WORK ON GANACHE!

// This contract stores all instances of Lottery. 
// As it is implemented right now, the user interacts with Lottery only through the LotteryFactory.
contract LotteryFactory{
    uint8 constant MIN_NUMBER = 1;
    uint8 constant MAX_NUMBER = 42;
    uint constant TICKET_PRICE = 1 ether;
    
    Lottery[] public lotteries;
    
    Lottery currentLottery;
    
    constructor() public{
        createNewLottery(0);
    }
    
    function createNewLottery(uint _prevCheckpot) internal{
        Lottery newLottery = new Lottery(_prevCheckpot);
        lotteries.push(newLottery);
        currentLottery = newLottery;
    }
    
    function getCurrentLottery() public view returns(Lottery){
        return currentLottery;
    }
    
    function buyTicket(uint8 _luckyNumber) public payable{
        //require(msg.value == TICKET_PRICE);
        //require(_luckyNumber >= MIN_NUMBER);
        //require(_luckyNumber <= MAX_NUMBER);
        //require(block.number > currentLottery.getDeployBlock());
        //require(block.number <= currentLottery.getEndBlock());

        currentLottery.addTicket(msg.sender, _luckyNumber, msg.value);
    }
    
    function getTickets() public view returns(uint8[] memory){
        return currentLottery.getTickets(msg.sender);
    }
    
    function endLottery() public{
        //require(block.number > currentLottery.getDrawBlock());
        
        // TODO draw number from Oracle
        uint8 drawnNumber = 1;
        
        currentLottery.setWinners(drawnNumber);
        
        if(currentLottery.getWinners().length > 0){
            createNewLottery(0);
        }
        else{
            // checkpot of old lottery is carried over to next lottery
            createNewLottery(currentLottery.getCheckpot());
        }
    }
    
    // A participant has to actively claim his winnings. 
    // reason1: Automatic payout is difficult. 
    // reason2: A function that pays out to all the shares to the winners must be called by someone. And this someone has to cover all the gas costs for every payment that the SC does in that function.
    function claimCheckpot(uint _lotteryIndex) public{
        Lottery lottery = lotteries[_lotteryIndex];
        require(lottery.isWinner(msg.sender));
        require(!lottery.hasClaimedCheckpot(msg.sender));
        
        // TODO this is buggy on my machine with Ganache
        msg.sender.transfer(lottery.getCheckpot()/lottery.getWinners().length);
        lottery.addAddressToClaims(msg.sender);
    }
    
    function getOwner() public view returns(address){
        return currentLottery.getOwner();
    }
    
    function getContractBalance() public view returns(uint){
        return address(this).balance;
    }
}

contract Lottery {
    uint8 constant DURATION_LOTTERY = 20;
    uint8 constant DURATION_AFTER_END = 5;
    
    struct Ticket{
        address owner;
        uint8 luckyNumber;
    }
    
    // owner of the lottery is the lottery factory SC. This is needed in order to restrict setter function only to be accessed by the setter factory.
    address owner;
    
    // the amount of Ethers that were not won or claimed from the previous Lottery
    uint prevCheckpot;
    
    // the amount of Ethers paid by participants from that round
    uint paymentsFromTickets;
    
    // the tickets that were bought in this round
    mapping (address=> uint8[]) tickets;
    
    // keeping track of the participants makes it easier to loop through the tickets
    address payable[] participants;
    
    // the address of the winners of that round (must be payable in order to transfer ether checkpot)
    address payable[] winners;
    
    // the address of the winners that claimed their share of the checkpot
    address[] claimedAddresses;

    // the block height when the lottery is deployed
    uint deployBlock;
    
    // the block height when the lottery ends
    uint endBlock;
    
    // the block height when the lucky number is drawn 
    // (must be larger than endBlock, otherwise a miner can include a guess when adding the block with the winner)
    uint drawBlock;
    
    constructor (uint _prevCheckpot) public {
        owner = msg.sender;
        paymentsFromTickets = 0;
        prevCheckpot = _prevCheckpot;
        deployBlock = block.number;
        endBlock = block.number + DURATION_LOTTERY;
        drawBlock = block.number + DURATION_AFTER_END;
    }
    
    function addTicket(address payable _buyerAddress, uint8 _luckyNumber, uint _price) public{
        require(owner == msg.sender);
        tickets[_buyerAddress].push(_luckyNumber);
        paymentsFromTickets += _price;
        participants.push(_buyerAddress);
    }
    
    function setWinners(uint8 _selectedNumber) public{
        require(owner == msg.sender);
        for(uint8 i = 0; i < participants.length; i++){
            for(uint8 j = 0; j < tickets[participants[i]].length; j++){
                if(tickets[participants[i]][j] == _selectedNumber){
                    winners.push(participants[i]);
                    break;
                }
            }
        }
    }
    
    function addAddressToClaims(address _address) public{
        require(owner == msg.sender);
        claimedAddresses.push(_address);
    }
    
    function getTickets(address _lookupAddress) public view returns(uint8[] memory){
        return tickets[_lookupAddress];
    }
    
    function getWinners() public view returns(address payable[] memory){
        return winners;
    }
    
    function isWinner(address _winningAddress) public view returns (bool){
        for(uint i = 0; i < winners.length; i++){
            if(_winningAddress == winners[i]){
                return true;
            }
        }
        return false;
    }
    
    function hasClaimedCheckpot(address _winningAddress) public view returns(bool){
        for(uint i = 0; i < claimedAddresses.length; i++){
            if(_winningAddress == claimedAddresses[i]){
                return true;
            }
        }
        return false;
    }
    
    function getDeployBlock() public view returns(uint){
        return deployBlock;
    }
    
    function getEndBlock() public view returns(uint){
        return endBlock;
    }
    
    function getDrawBlock() public view returns(uint){
        return drawBlock;
    }
    
    function getCheckpot() public view returns(uint){
        return prevCheckpot + paymentsFromTickets;
    }
    
    function getOwner() public view returns(address){
        return owner;
    }
    
    function getParticipants() public view returns(address payable[] memory){
        return participants;
    }
}
