import React, { Component } from "react";
import LotteryContract from "../contracts/Lottery.json";
import getWeb3 from "../utils/getWeb3";
import {weiToEther, etherToWei} from "../utils/conversion";

import Wrapper from "../Components/shared/Wrapper";
import Loading from "../Components/shared/Loading";

import Dashboard from "../Components/Dashboard/Dashboard";
import Tickets from "../Components/Tickets/Tickets";
import Game from "../Components/Game/Game";

import { Button, Grid, Segment } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";

class App extends Component {
  _isMounted = false;

  state = {
    accounts: null,
    activeAccount: null,
    activeAccountBalance: -1,
    contract: null,
    currentBlock: null,
    drawBlock: null,
    endBlock: null,
    jackpot: null,
    startBock: null,
    tickets: null,
    maxNumber: -1,
    minNumber: -1,
    web3: null
  };

  /////////////////////////////////////////////////////////////////////////////
  // cleanup component state
  /////////////////////////////////////////////////////////////////////////////
  componentWillUnmount = () => {
    this._isMounted = false;
    clearInterval(this.fetchDataPolling);
  };

  /////////////////////////////////////////////////////////////////////////////
  // initialize component state
  /////////////////////////////////////////////////////////////////////////////

  componentDidMount = async () => {
    this._isMounted = true;

    try {
      // get network provider and web3 instance
      const web3 = await getWeb3();

      // get the contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LotteryContract.networks[networkId];
      const contract = new web3.eth.Contract(
        LotteryContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // set web3 and contract to the state
      if (this._isMounted) {
        this.setState({
          web3,
          contract
        });
      }

      // initially fetch data from the smart contract and store it in the state
      this.fetchInitialData();
      this.fetchData();
    } catch (error) {
      // catch any errors for any of the above operations
      console.error(error);
      alert(
        "Failed to load web3, accounts, or contract. Check console for details."
      );
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  // fetch data
  /////////////////////////////////////////////////////////////////////////////
  fetchDataPolling = setInterval(() => {
    this.fetchData();
  }, 2000);

  fetchInitialData = async () => {
    const { contract } = this.state;

    // get minimum allowed number for tickets
    const minNumber = await contract.methods.getMinNumber().call();
    if (this._isMounted) {
      this.setState({
        minNumber: parseInt(minNumber, 10)
      });
    }

    // get maximum allowed number for tickets
    const maxNumber = await contract.methods.getMaxNumber().call();
    if (this._isMounted) {
      this.setState({
        maxNumber: parseInt(maxNumber, 10)
      });
    }
  };

  fetchData = async () => {
    const { contract, web3 } = this.state;

    // fetch accounts from metamask
    const accounts = await web3.eth.getAccounts();
    if (this._isMounted) {
      this.setState({ accounts: accounts });
    }

    // get active account
    const activeAccount = accounts[0];
    if (this._isMounted) {
      this.setState({ activeAccount: activeAccount });
    }

    // fetch balance of active account
    const activeAccountBalance = await web3.eth.getBalance(activeAccount);
    if (this._isMounted) {
      this.setState({ activeAccountBalance: activeAccountBalance });
    }

    this.updateTickets(contract);
    this.updateJackpot(contract);
    this.updateCurrentBlock(web3);
    this.updateGameBlocks(contract);
  };

  updateTickets = async contract => {
    const tickets = await contract.methods.getMyTickets().call();
    if (this._isMounted) {
      this.setState({ tickets: tickets });
    }
  };

  updateJackpot = async contract => {
    const jackpot = await contract.methods.getJackpot().call();
    if (this._isMounted) {
      this.setState({ jackpot: weiToEther(jackpot) });
    }
  };

  updateCurrentBlock = async web3 => {
    const currentBlock = await web3.eth.getBlockNumber();
    if (this._isMounted) {
      this.setState({ currentBlock: currentBlock });
    }
  };

  updateGameBlocks = async contract => {
    const startBlock = await contract.methods
      .getStartBlockOfCurrentGame()
      .call();
    const endBlock = await contract.methods.getEndBlockOfCurrentGame().call();
    const drawBlock = await contract.methods.getDrawBlockOfCurrentGame().call();
    if (this._isMounted) {
      this.setState({
        startBlock: parseInt(startBlock, 10),
        endBlock: parseInt(endBlock, 10),
        drawBlock: parseInt(drawBlock, 10)
      });
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  // click handlers
  /////////////////////////////////////////////////////////////////////////////

  buyTicketClickHandler = async number => {
    const { contract, accounts } = this.state;
    const hasGameEnded = await contract.methods.hasGameEnded().call();

    if (hasGameEnded) {
      alert("Game has ended!");
      return;
    }

    if (!this.isNumber(number) || !this.isValid(number)) {
      alert("Must be a number between 1 and 5!");
      return;
    }

    await contract.methods
      .buyTicket(number)
      .send({ from: accounts[0], value: etherToWei(1) });

    this.fetchData();
  };

  endGameClickHandler = async () => {
    const { contract, accounts } = this.state;
    const hasGameEnded = await contract.methods.hasGameEnded().call();

    if (!hasGameEnded) {
      alert("Game is still running!");
      return;
    }

    await contract.methods.endGame().send({ from: accounts[0] });

    this.fetchData();
  };

  // TODO: remove as soon as it is not needed anymore
  skipBlockHandler = async () => {
    const { contract, accounts } = this.state;

    await contract.methods.skipBlock().send({ from: accounts[0] });

    this.fetchData();
  };

  /////////////////////////////////////////////////////////////////////////////
  // utils
  /////////////////////////////////////////////////////////////////////////////

  isNumber = inputToCheck => {
    return !isNaN(inputToCheck);
  };

  isValid = inputToCheck => {
    if (!this.isNumber(inputToCheck)) {
      return false;
    }
    return inputToCheck > 0 && inputToCheck < 6;
  };

  /////////////////////////////////////////////////////////////////////////////
  // render component
  /////////////////////////////////////////////////////////////////////////////
  render() {
    return (
      <div>
        {/* TODO: remove as soon as it is not needed anymore*/}
        <div style={{ textAlign: "center", margin: "1rem" }}>
          <Button secondary onClick={this.skipBlockHandler}>
            Skip Block
          </Button>
        </div>
        <Wrapper>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <div style={{ textAlign: "center", margin: "1rem" }}>
                  <Segment>
                    <strong>Account: </strong>
                    {this.state.activeAccount}
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column width={8}>
                <div style={{ textAlign: "center", margin: "1rem" }}>
                  <Segment>
                    Your account has{" "}
                    <strong>
                      {weiToEther(this.state.activeAccountBalance)}
                    </strong>{" "}
                    ETH
                  </Segment>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                {this.state.web3 ? (
                  <div>
                    <Dashboard
                      jackpot={this.state.jackpot}
                      startBlock={this.state.startBlock}
                      currentBlock={this.state.currentBlock}
                      endBlock={this.state.endBlock}
                      drawBlock={this.state.drawBlock}
                    />
                    <Game
                      minNumber={this.state.minNumber}
                      maxNumber={this.state.maxNumber}
                      buyTicket={this.buyTicketClickHandler}
                      endGame={this.endGameClickHandler}
                    />
                    <Tickets tickets={this.state.tickets} />
                  </div>
                ) : (
                  <Loading
                    message={"Loading Web3, accounts, and contract..."}
                  />
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Wrapper>
      </div>
    );
  }
}

export default App;
