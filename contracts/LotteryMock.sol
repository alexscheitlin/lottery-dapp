pragma solidity ^0.5.0;

contract LotteryMock {
    
    uint constant GAME_LENGTH = 5;          // number of blocks
    uint constant TICKET_PRICE = 1 ether;
    uint constant MIN_NUMBER = 1;
    uint constant MAX_NUMBER = 5;
    
    struct Game {
        uint startBlock;
        uint endBlock;
        mapping (address => uint[]) tickets;
    }
    
    mapping (uint => Game) finishedGames;
    
    Game public currentGame;
    
    constructor() public {
        currentGame = createNewGame(GAME_LENGTH);
    }
    
    // /////////////////////////////////////////////////////////////////
    // pubic functions
    // /////////////////////////////////////////////////////////////////
    
    function buyTicket(uint number) public payable {
        // verify that enough ether was sent
        require(msg.value == TICKET_PRICE);
        
        // verify that the number is not too small
        require(number >= MIN_NUMBER);
        
        // verify that the number is not too large
        require(number <= MAX_NUMBER);
        
        // verify that the current game is ongoing
        require(this.isGameOngoing());
        
        // record the sender's address and the received number
        currentGame.tickets[msg.sender].push(number);
    }
    
    // returns the numbers in the current game associated with the sender's address
    function getMyTickets() public view returns(uint[] memory) {
        return currentGame.tickets[msg.sender];
    }

    // return the smart contract's account balance
    function getJackpot() public view returns(uint) {
        return address(this).balance;
    }
    
    // returns whether the current game has started
    function hasGameStarted() public view returns(bool) {
        return block.number >= currentGame.startBlock;
    }
    
    // returns whether the current game has ended
    function hasGameEnded() public view returns(bool) {
        return block.number > currentGame.endBlock;
    }
    
    // returns whether the current game is ongoing
    function isGameOngoing() public view returns(bool) {
        return this.hasGameStarted() && !this.hasGameEnded();
    }
    
    
    // /////////////////////////////////////////////////////////////////
    // private functions
    // /////////////////////////////////////////////////////////////////
    
    function createNewGame(uint gameLength) private view returns(Game memory) {
        Game memory newGame = Game({
            startBlock: block.number,
            endBlock: block.number + gameLength
        });
        
        return newGame;
    }
}