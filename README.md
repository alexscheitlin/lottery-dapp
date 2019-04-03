# Lottery dApp

This project was bootstrapped with [Truffle]([https://github.com/facebook/create-react-app](https://github.com/trufflesuite/truffle/)).

```bash
npm install -g truffle
truffle unbox react
```

## Prerequisites

- [Git](https://git-scm.com/) command line interface
- [Node.js](https://nodejs.org/) command line interface
- [Metamask Extension](https://metamask.io/) for your browser (including wallet)
- [Ganache](https://truffleframework.com/ganache) desktop application

## Setup

_onetime setup_

### Clone the Project

```bash
git clone https://github.com/alexscheitlin/lottery-dapp

# or

git clone git@github.com:alexscheitlin/lottery-dapp
```

### Set up Client

```bash
cd lottery-dapp/client/
npm install
```
_Detailed information can be found here: [README](./client/README.md)._

### Install Truffle

```bash
npm install -g truffle

# or

sudo npm install -g truffle
```

### Setup Metamask

1. Start `Ganache` and copy the _RPC Server_ address (most likely: `http://127.0.0.1:7545`).
2. Open `Metamask` in your browser and login with your wallet.
3. Click on the network dropdown and select _Custom RPC_.
4. Scroll down and enter the copied `RPC Server` of `Ganache` into the _New RPC URL_ field.
5. Hit _Save_.
6. Go to `Ganache` an click the _key symbol_ to the very right of the first address to copy this address' private key.
7. Back in `Metamask`, click on the _colored circle_ on the top right and select _Import Account_.
8. Paste the private key from `Ganache` and hit _Import_. You should no be logged in with an Account from the `Ganache` network with a balance of _100 ETH_.

## Run Environment

_everytime to run the environment_

1. Pull the latest commits:
   ```bash
   # Terminal Tab #1
   cd /path/to/lottery-dapp
   git pull
   ```
2. Start `Ganache`.
3. Compile the `Smart Contracts`:
   ```bash
   # Terminal Tab #1
   truffle compile
   ```
4. Deploy the `Smart Contracts` on the `Ganache` network:
   ```bash
   # Terminal Tab #1
   truffle migrate --reset
   ```
4. Start the `Truffle` console:
   ```bash
   # Terminal Tab #1
   truffle console
   ```
5. Start the `React` client:
   ```bash
   # Terminal Tab #2
   cd /path/to/lottery-dapp/client
   npm install
   npm start
   ```
6. Go to `localhost:3000` in your browser, accept the transaction and the page should display that a value of _5_ is stored.
