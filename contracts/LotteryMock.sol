pragma solidity ^0.5.0;

contract LotteryMock {
    
    uint constant GAME_LENGTH = 3;          // number of blocks
    uint constant TICKET_PRICE = 1 ether;
    uint constant MIN_NUMBER = 1;
    uint constant MAX_NUMBER = 5;
    
    struct Game {
        uint startBlock;
        uint endBlock;
        uint luckyNumber;
        mapping (uint => Participant) participants;
        mapping (uint => address payable) winners;
        
        // keep track of number of participants and winners to iterate
        uint numberOfParticipants;
        uint numberOfWinners;
    }
    
    struct Participant {
        address payable addr;
        uint[] numbers;
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
        bool foundParticipant = false;
        for (uint i=0; i<currentGame.numberOfParticipants; i++) {
            // add number to existing participant
            if (currentGame.participants[i].addr == msg.sender) {
                currentGame.participants[i].numbers.push(number);
                foundParticipant = true;
                break;
            }
        }
        
        if (!foundParticipant) {
            // create new participant
            uint[] memory numbers = new uint[](1);
            numbers[0] = number;
            
            Participant memory p = Participant({
                addr: msg.sender,
                numbers: numbers
            });
            
            currentGame.participants[currentGame.numberOfParticipants++] = p;
        }
    }
    
    function endGame() public {
        // verify that game has ended
        require(this.hasGameEnded());
        
        // TODO: draw lucky number via oracle SC
        uint drawnNumber = 1;
        
        // determine winners
        for (uint i=0; i<currentGame.numberOfParticipants; i++) {
            for (uint j=0; i<currentGame.participants[i].numbers.length; j++) {
                if (currentGame.participants[i].numbers[j] == drawnNumber) {
                    currentGame.winners[currentGame.numberOfWinners++] = currentGame.participants[i].addr;
                    break;
                }
            }
        }
        
        // TODO: refund caller
        
        // payout winners
        for (uint i=0; i<currentGame.numberOfWinners; i++) {
            currentGame.winners[i].transfer(address(this).balance / currentGame.numberOfWinners);
        }
        
        // TODO: archive game
        
        // start new game
        //currentGame = createNewGame(GAME_LENGTH);
    }
    
    // returns the tickets (= numbers) in the current game associated with the sender's address
    function getMyTickets() public view returns(uint[] memory) {
        uint[] memory numbers;
            
        for (uint i=0; i<currentGame.numberOfParticipants; i++) {
            if (currentGame.participants[i].addr == msg.sender) {
                numbers = currentGame.participants[i].numbers;
                break;
            }
        }
        return numbers;
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
    
    // returns minimum required number to buy a ticket (inclusive)
    function getMinNumber() public pure returns(uint) {
        return MIN_NUMBER;
    }
    
    // returns maximum allowed number to buy a ticket (inclusive)
    function getMaxNumber() public pure returns(uint) {
        return MAX_NUMBER;
    }
    
    
    // /////////////////////////////////////////////////////////////////
    // private functions
    // /////////////////////////////////////////////////////////////////
    
    function createNewGame(uint gameLength) private view returns(Game memory) {
        Game memory newGame = Game({
            startBlock: block.number,
            endBlock: block.number + gameLength,
            luckyNumber: 0,
            numberOfParticipants: 0,
            numberOfWinners: 0
        });
        
        return newGame;
    }
}