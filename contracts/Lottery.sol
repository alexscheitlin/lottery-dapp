pragma solidity ^0.5.0;

import "./RandomNumberOracle.sol";

contract Lottery {
    
    uint256 public constant GAME_LENGTH = 3;          // number of blocks
    uint256 public constant TICKET_PRICE = 1 ether;
    uint256 public constant REFUND_AMOUNT = 0.1 ether;
    uint256 public constant MIN_NUMBER = 1;             // minimum required number in a ticket (inclusive)
    uint256 public constant MAX_NUMBER = 5;             // maximum allowed number in a ticket (inclusive)
    uint256 public constant MAX_AMOUNT_TICKETS = 3;
    uint256 public constant MAX_PARTICIPANTS = 50;
    uint256 public constant NUMBERS_PER_TICKET = 2;
    
    struct Game {
        uint256 startBlock;
        uint256 endBlock;
        uint256 drawBlock;
        uint256[] luckyNumbers;
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
        uint256[][] tickets;
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
    
    function buyTicket(uint256[] memory numbers) public payable {
        // verify that enough ether was sent
        require(msg.value == TICKET_PRICE);
        
        // verify that the current game is ongoing
        require(this.isGameOngoing());
        
        // verify that enough numbers are given
        require(numbers.length == NUMBERS_PER_TICKET);
        
        // verify that the numbers are not too small or too large
        for (uint256 i=0; i<numbers.length; i++) {
            require(numbers[i] >= MIN_NUMBER);
            require(numbers[i] <= MAX_NUMBER);
        }
        
        // verify that every number is only represented at max once
        // TODO
        
        // record the sender's address and the received numbers
        bool foundParticipant = false;
        for (uint256 i=0; i<currentGame.numberOfParticipants; i++) {
            // add number to existing participant
            if (currentGame.participants[i].addr == msg.sender) {
                // verify that buyer has not bought too many tickets
                require(currentGame.participants[i].tickets.length < MAX_AMOUNT_TICKETS);
                
                currentGame.participants[i].tickets.push(numbers);
                foundParticipant = true;
                break;
            }
        }
        
        if (!foundParticipant) {
            // verify that the number of participants does not exceed the participant limit
            require(currentGame.numberOfParticipants < MAX_PARTICIPANTS);
            
            // create new participant
            uint256[][] memory tickets = new uint256[][](1);
            tickets[0] = numbers;
            
            Participant memory p = Participant({
                addr: msg.sender,
                tickets: tickets
            });
            
            currentGame.participants[currentGame.numberOfParticipants++] = p;
        }
    }
    
    function endGame() public {
        // verify that game has ended and numbers are drawable
        require(this.isNumberDrawable());
        
        // draw lucky numbers via oracle SC
        uint256[] memory luckyNumbers = new uint256[](NUMBERS_PER_TICKET);
        for (uint256 i=0; i<NUMBERS_PER_TICKET; i++) {
            luckyNumbers[i] = oracle.getRandomNumber(MIN_NUMBER, MAX_NUMBER, currentGame.drawBlock - i);
        }
        
        currentGame.luckyNumbers = luckyNumbers;
        
        // keep track of jackpot
        currentGame.jackpot = getJackpot();

        // keep track of lottery resolver
        currentGame.resolver = msg.sender;

        // archive all the statically allocated values
        finishedGames[numberOfGames] = currentGame;
        
        // refund caller and payout winners
        if (currentGame.numberOfParticipants > 0) {
            // determine winners
            for (uint256 i=0; i<currentGame.numberOfParticipants; i++) { // participant i
                for (uint256 j=0; j<currentGame.participants[i].tickets.length; j++) { // ticket j
                    // TODO: this is very inefficient (maybe use mappings to determine whether a user has all lucky numbers within one ticket)
                    bool isWinnerTicket = true;
                    for (uint256 k=0; k<currentGame.luckyNumbers.length; k++) { // lucky number k
                        
                        // check if a lucky number is present in this ticket
                        bool isNumberInTicket = false;
                        for (uint256 l=0; l<currentGame.participants[i].tickets[j].length; l++) { // number l of ticket j
                            if (currentGame.participants[i].tickets[j][l] == currentGame.luckyNumbers[k]) {
                                // lucky number is present in this tickets
                                // => no need to look at the other numbers of this ticket for this lucky number
                                isNumberInTicket = true;
                                break;
                            }
                        }
                        
                        // if the lucky number is not present in the ticket, this ticket is not a winner ticket
                        // => no need to check the remaining lucky numbers
                        if (!isNumberInTicket) {
                            isWinnerTicket = false;
                            break;
                        }
                        
                    }
                    
                    if (isWinnerTicket) {
                        // add participant as winner
                        currentGame.winners[currentGame.numberOfWinners++] = currentGame.participants[i].addr;
    
                        // archiving winners
                        finishedGames[numberOfGames].winners[finishedGames[numberOfGames].numberOfWinners++] = currentGame.participants[i].addr;
                        
                        // no need to search for a second winner ticket
                        break;
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
    
    // returns the number of tickets in the current game associated with the sender's address
    function getMyTicketCountOfCurrentGame() public view returns(uint256) {
        uint256 numberOfTickets = 0;
            
        for (uint256 i=0; i<currentGame.numberOfParticipants; i++) {
            if (currentGame.participants[i].addr == msg.sender) {
                numberOfTickets = currentGame.participants[i].tickets.length;
                break;
            }
        }
        return numberOfTickets;
    }
    
    // returns the numbers of a ticket in the current game associated with the sender's address
    function getMyTicketNumbersOfCurrentGame(uint256 _ticketIndex) public view returns(uint256[] memory) {
        uint256[] memory numbers;
            
        for (uint256 i=0; i<currentGame.numberOfParticipants; i++) {
            if (currentGame.participants[i].addr == msg.sender) {
                numbers = currentGame.participants[i].tickets[_ticketIndex];
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

    // get luck numbers of a specific (finished) game
    function getLuckyNumbers(uint256 _gameIndex) public view returns(uint256[] memory){
        return finishedGames[_gameIndex].luckyNumbers;
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
    
    // get the number of tickets of an address in a specific game
    function getTicketCount(uint256 _gameIndex, address _address) public view returns(uint256) {
        for(uint256 i = 0; i < finishedGames[_gameIndex].numberOfParticipants; i++){
            if(finishedGames[_gameIndex].participants[i].addr == _address){
               return finishedGames[_gameIndex].participants[i].tickets.length;
            }
        }
    }

    // get the numbers of a ticket of an address in a specific game
    function getTicketNumbers(uint256 _gameIndex, uint256 _ticketIndex, address _address) public view returns(uint256[] memory){
        for(uint256 i = 0; i < finishedGames[_gameIndex].numberOfParticipants; i++){
            if(finishedGames[_gameIndex].participants[i].addr == _address){
               return finishedGames[_gameIndex].participants[i].tickets[_ticketIndex];
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
        uint256[] memory luckyNumbers;
        Game memory newGame = Game({
            startBlock: block.number,
            endBlock: block.number + gameLength,
            drawBlock: block.number + gameLength + NUMBERS_PER_TICKET,
            luckyNumbers: luckyNumbers,
            numberOfParticipants: 0,
            numberOfWinners: 0,
            jackpot: 0,
            resolver: address(0)
        });
        
        return newGame;
    }
}