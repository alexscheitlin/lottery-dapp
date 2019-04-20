import React, { Component } from "react";
import LotteryContract from "../contracts/Lottery.json";
import getWeb3 from "../utils/getWeb3";
import { weiToEther, etherToWei } from "../utils/conversion";

import Wrapper from "../Components/shared/Wrapper";
import Loading from "../Components/shared/Loading";

import Dashboard from "../Components/Dashboard/Dashboard";
import Tickets from "../Components/Tickets/Tickets";
import Game from "../Components/Game/Game";

import { Button, Grid, Segment, Modal, Header, Icon } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";

class App extends Component {
  _isMounted = false;

  state = {
    gameEnded: null,
    isNumberDrawable: null,
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
    web3: null,

    showErrorModal: false,
    errorModalHeader: "",
    errorModalText: "Please try again if this was not your intention!"
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
    if (!this._isMounted) {
      return;
    }

    this.setState({
      gameEnded: await this.state.contract.methods.hasGameEnded().call(),
      minNumber: parseInt(
        await this.state.contract.methods.getMinNumber().call(),
        10
      ),
      maxNumber: parseInt(
        await this.state.contract.methods.getMaxNumber().call(),
        10
      )
    });
  };

  fetchData = async () => {
    if (!this._isMounted) {
      return;
    }

    const { contract, web3 } = this.state;

    // fetch accounts from metamask
    const accounts = await web3.eth.getAccounts();
    const activeAccount = accounts[0];

    this.setState({
      gameEnded: await contract.methods.hasGameEnded().call(),
      isNumberDrawable: await contract.methods.isNumberDrawable().call(),
      accounts: accounts,
      activeAccount: activeAccount,
      activeAccountBalance: await web3.eth.getBalance(activeAccount)
    });

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
      .send({ from: accounts[0], value: etherToWei(1) })
      .catch(err => {
        this.setState({
          showErrorModal: true,
          errorModalHeader: "Buy Ticket rejected - no data was sent"
        });
      });

    this.fetchData();
  };

  endGameClickHandler = async () => {
    const { contract, accounts } = this.state;
    const hasGameEnded = await contract.methods.hasGameEnded().call();

    if (!hasGameEnded) {
      alert("Game is still running!");
      return;
    }

    if (!this.state.isNumberDrawable) {
      alert("Game is not ready to draw!");
      return;
    }
    
    await contract.methods
      .endGame()
      .send({ from: accounts[0] })
      .catch(err => {
        this.setState({
          showErrorModal: true,
          errorModalHeader: "End Game rejected - no data was sent"
        });
      });

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
                      gameEnded={this.state.gameEnded}
                      numberDrawable={this.state.isNumberDrawable}
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
                {this.state.showErrorModal ? (
                  <Modal
                    basic
                    size="tiny"
                    open={this.state.showErrorModal}
                    onClose={() =>
                      this.setState({
                        showErrorModal: false,
                        errorModalHeader: "",
                        errorModalText: ""
                      })
                    }
                  >
                    <Header>
                      <Icon name="exclamation" />
                      <Header.Content>
                        {this.state.errorModalHeader}
                      </Header.Content>
                    </Header>
                    <Modal.Content>{this.state.errorModalText}</Modal.Content>
                  </Modal>
                ) : null}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Wrapper>
      </div>
    );
  }
}

export default App;
