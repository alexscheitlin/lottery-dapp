import React, { Component } from "react";

import Wrapper from "../Components/shared/Wrapper";
import LotteryContract from "../contracts/Lottery.json";
import getWeb3 from "../utils/getWeb3";
import {weiToEther, etherToWei} from "../utils/conversion";

import { Grid, Segment } from "semantic-ui-react";

class History extends Component {
  _isMounted = false;

  state = {
    web3: null,
    contract: null,
    jackpot: null
  };

  /////////////////////////////////////////////////////////////////////////////
  // initialize component state
  /////////////////////////////////////////////////////////////////////////////
  loadWeb3 = async () => {
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

  fetchData = async () => {
    console.log("[History] fetchData");
    const { contract, web3 } = this.state;
    this.updateJackpot(contract);
  };

  updateJackpot = async contract => {
    const jackpot = await contract.methods.getJackpot().call();
    if (this._isMounted) {
      this.setState({ jackpot: weiToEther(jackpot) });
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  // react life cycle hooks
  /////////////////////////////////////////////////////////////////////////////
  componentDidMount = () => {
    this._isMounted = true;
    this.loadWeb3();
  };

  componentWillUnmount = () => {
    this._isMounted = false;
    clearInterval(this.fetchDataPolling);
  };

  /////////////////////////////////////////////////////////////////////////////
  // render component
  /////////////////////////////////////////////////////////////////////////////
  render() {
    return (
      <Wrapper>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Segment>
                There are {this.state.jackpot || 0} ETH in the Jackpot right now
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Wrapper>
    );
  }
}

export default History;
