pragma solidity ^0.5.0;

import "./RandomNumberOracle.sol";

contract Lottery {
    
    uint256 constant GAME_LENGTH = 3;          // number of blocks
    uint256 constant DRAW_PERIOD = 1;          // number of blocks
    uint256 constant TICKET_PRICE = 1 ether;
    uint256 constant REFUND_AMOUNT = 0.1 ether;
    uint256 constant MIN_NUMBER = 1;
    uint256 constant MAX_NUMBER = 5;
    uint256 constant MAX_AMOUNT_TICKETS = 3;
    uint256 constant MAX_PARTICIPANTS = 50;
    
    struct Game {
        uint256 startBlock;
        uint256 endBlock;
        uint256 drawBlock;
        uint256 luckyNumber;
        mapping (uint256 => Participant) participants;
        mapping (uint256 => address payable) winners;
        
        // keep track of number of participants and winners to iterate
        uint256 numberOfParticipants;
        uint256 numberOfWinners;
        
        // keep track of jackpot
        uint256 jackpot;

        // keep track of lottery resolver
        address resolver;
    }
    
    struct Participant {
        address payable addr;
        uint256[] numbers;
    }
    
    Game public currentGame;
    
    RandomNumberOracle oracle;
    
    mapping (uint256 => Game) public finishedGames;
    uint256 numberOfGames = 0;

    constructor() public {
        currentGame = createNewGame(GAME_LENGTH);
        oracle = new RandomNumberOracle();
    }
    
    // /////////////////////////////////////////////////////////////////
    // pubic functions
    // /////////////////////////////////////////////////////////////////
    
    function buyTicket(uint256 number) public payable {
        // verify that enough ether was sent
        require(msg.value == TICKET_PRICE);
        
        // verify that the number is not too small
        require(number >= MIN_NUMBER);
        
        // verify that the number is not too large
        require(number <= MAX_NUMBER);
        
        // verify that the current game is ongoing
        require(this.isGameOngoing());
        
        // record the sender's address and the received number
        bool foundParticipant = false;
        for (uint256 i=0; i<currentGame.numberOfParticipants; i++) {
            // add number to existing participant
            if (currentGame.participants[i].addr == msg.sender) {
                
                // verify that buyer has not bought too many tickets
                require(currentGame.participants[i].numbers.length < MAX_AMOUNT_TICKETS);
                
                currentGame.participants[i].numbers.push(number);
                foundParticipant = true;
                break;
            }
        }
        
        if (!foundParticipant) {
            // verify that the number of participants does not exceed the participant limit
            require(currentGame.numberOfParticipants < MAX_PARTICIPANTS);
            
            // create new participant
            uint256[] memory numbers = new uint256[](1);
            numbers[0] = number;
            
            Participant memory p = Participant({
                addr: msg.sender,
                numbers: numbers
            });
            
            currentGame.participants[currentGame.numberOfParticipants++] = p;
        }
    }
    
    function endGame() public {
        // verify that game has ended and numbers are drawable
        require(this.isNumberDrawable());
        
        // draw lucky number via oracle SC
        currentGame.luckyNumber = oracle.getRandomNumber(MIN_NUMBER, MAX_NUMBER, currentGame.drawBlock);
        
        // keep track of jackpot
        currentGame.jackpot = getJackpot();

        // keep track of lottery resolver
        currentGame.resolver = msg.sender;

        // archive all the statically allocated values
        finishedGames[numberOfGames] = currentGame;
        
        // refund caller and payout winners
        if (currentGame.numberOfParticipants > 0) {
            // determine winners
            for (uint256 i=0; i<currentGame.numberOfParticipants; i++) {
                for (uint256 j=0; j<currentGame.participants[i].numbers.length; j++) {
                    if (currentGame.participants[i].numbers[j] == currentGame.luckyNumber) {
                        currentGame.winners[currentGame.numberOfWinners++] = currentGame.participants[i].addr;

                        // archiving winners
                        finishedGames[numberOfGames].winners[finishedGames[numberOfGames].numberOfWinners++] = currentGame.participants[i].addr;
                    }
                }
                // archiving participants
                finishedGames[numberOfGames].participants[i] = currentGame.participants[i];
            }
        
            // refund caller
            msg.sender.transfer(REFUND_AMOUNT);
        
            // payout winners
            for (uint256 i=0; i<currentGame.numberOfWinners; i++) {
                currentGame.winners[i].transfer(currentGame.jackpot / currentGame.numberOfWinners);
            }
        }

        numberOfGames++;
        
        // start new game
        currentGame = createNewGame(GAME_LENGTH);
    }
    
    // returns the tickets (= numbers) in the current game associated with the sender's address
    function getMyTickets() public view returns(uint256[] memory) {
        uint256[] memory numbers;
            
        for (uint256 i=0; i<currentGame.numberOfParticipants; i++) {
            if (currentGame.participants[i].addr == msg.sender) {
                numbers = currentGame.participants[i].numbers;
                break;
            }
        }
        return numbers;
    }

    // return the winnable amount in the ongoing game
    function getJackpot() public view returns(uint256) {
        if (address(this).balance >= REFUND_AMOUNT) {
            return address(this).balance - REFUND_AMOUNT;
        } else {
            return 0;
        }
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
    
    // returns whether the game is ready to draw numbers
    function isNumberDrawable() public view returns(bool) {
        return block.number > currentGame.drawBlock;
    }
    
    // returns minimum required number to buy a ticket (inclusive)
    function getMinNumber() public pure returns(uint256) {
        return MIN_NUMBER;
    }
    
    // returns maximum allowed number to buy a ticket (inclusive)
    function getMaxNumber() public pure returns(uint256) {
        return MAX_NUMBER;
    }
    
    function getNumberOfFinishedGames() public view returns(uint256) {
        return numberOfGames;
    }
    
    function getStartBlockOfCurrentGame() public view returns(uint256) {
        return currentGame.startBlock;
    }
    
    function getEndBlockOfCurrentGame() public view returns(uint256) {
        return currentGame.endBlock;
    }
    
    function getDrawBlockOfCurrentGame() public view returns(uint256){
        return currentGame.drawBlock;
    }
    
    function getCurrentBlock() public view returns(uint256) {
        return block.number;
    }

    // get all participants in a specific game
    function getParticipants(uint256 gameIndex) public view returns(address[] memory _participantsAddr){
        _participantsAddr = new address[](finishedGames[gameIndex].numberOfParticipants);
        
        for(uint256 i = 0; i < finishedGames[gameIndex].numberOfParticipants; i++){
            _participantsAddr[i] = finishedGames[gameIndex].participants[i].addr;
        }
        
        return _participantsAddr;
    }
    
    // get the winners of a specific game
    function getWinners(uint256 gameIndex) public view returns(address[] memory _winners){
        _winners = new address[](finishedGames[gameIndex].numberOfWinners);
        
        for(uint256 i = 0; i < finishedGames[gameIndex].numberOfWinners; i++){
            _winners[i] = finishedGames[gameIndex].winners[i];
        }
        
        return _winners;
    }

    // get the tickets of an address in a specific game
    function getParticipantNumbers(uint _gameIndex, address _address) public view returns(uint256[] memory){
        for(uint256 i = 0; i < finishedGames[_gameIndex].numberOfParticipants; i++){
            if(finishedGames[_gameIndex].participants[i].addr == _address){
               return finishedGames[_gameIndex].participants[i].numbers;
            }
        }
    }
    
    // This function is only used to force ganache to add a block and thus controll the speed of the blockchain manually
    // TODO: remove as soon as it is not needed anymore
    function skipBlock() public pure {}
    
    // /////////////////////////////////////////////////////////////////
    // private functions
    // /////////////////////////////////////////////////////////////////
    
    function createNewGame(uint256 gameLength) private view returns(Game memory) {
        Game memory newGame = Game({
            startBlock: block.number,
            endBlock: block.number + gameLength,
            drawBlock: block.number + gameLength + DRAW_PERIOD,
            luckyNumber: 0,
            numberOfParticipants: 0,
            numberOfWinners: 0,
            jackpot: 0,
            resolver: address(0)
        });
        
        return newGame;
    }
}