# Lottery dApp 
This branch is created for demonstrating how the lottery behaves with two winners and the jackpot is split among them. 

## Demo Setting
1. Ganache is running on port 8542
2. React App is running on port 3002
3. Smart Contract variables:

```
// 1 for starting the game + 2 * (buying 2 tickets for each account)
GAME_LENGTH = 5;
MAX_NUMBER = 2;
MIN_NUMBER = 1;
NUMBERS_PER_TICKET = 1;
``` 

## Demo Setup
1. Run ganache-cli on the correct port 

    ```bash
    ganache-cli --port 8542
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

7. Change Metamask network to Custom RPC with the network URL "http://localhost:8542"

8. Import 2 private keys from the ganache-cli into metamask


## How to demonstrate two winner
1. Buy two ticket from account1 [number 1 and 2]
2. Switch to account2 in Metamask 
3. Buy two tickets from account2 [number 1 and 2]
4. Draw one number with the provided Helper-Button
5. Check history for winners
6. Check Metamask if jackpot was paid out