# Lottery dApp 
This branch is created for demonstrating how the lottery behaves with no winners and how the jackpot is carried over to the next lottery. 

## Demo Setting
1. Ganache is running on port 8540
2. React App is running on port 3000
3. Smart Contract variables:

```
// 1 for starting the game + 2 * (buying 2 tickets for each account)
GAME_LENGTH = 2;
MAX_NUMBER = 42;
MIN_NUMBER = 1;
NUMBERS_PER_TICKET = 6;
``` 

## Demo Setup
1. Run ganache-cli on the correct port 

    ```bash
    ganache-cli --port 8540
    ````

2. Start the `Truffle` console:
    ```bash
    # Terminal Tab #1
    truffle console
    ```
3. Within the trufle console, compile the `Smart Contracts`:
    ```bash
    # Terminal Tab #1
    compile
    ```
4. Deploy the `Smart Contracts` on the `Ganache` network:
    ```bash
    # Terminal Tab #1
    migrate --reset
    ```
5. Start the `React` client:
   ```bash
   # Terminal Tab #2
   cd /path/to/lottery-dapp/client
   npm install
   npm start
   ```
6. `localhost:3002` should be opened automatically in your browser

7. Change Metamask network to Custom RPC with the network URL "http://localhost:8540"

8. Import 2 private keys from the ganache-cli into metamask


## How to demonstrate two winner
1. Buy one ticket from account1 [any 6 numbers]
2. Draw number with the provided Helper-Button six times (for every lucky number once)
3. Check history for drawn numbers
4. Check out next lottery with the carried over jackpot (note: the jackpot is 0.01 ETH smaller than the previous, due to the fact that we compansate the caller of endGame())