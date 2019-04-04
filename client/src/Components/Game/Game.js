import React, { Component } from "react";

import NumberGrid from "./NumberGrid";

import { Segment, Header, Input, Button } from "semantic-ui-react";

class Game extends Component {
  state = {
    numberGrid: [
      1, 2, 3, 4, 5
    ],
    pressedNumber: -1
  };

  handleChange = e => {
    this.setState({
      number: e.target.value
    });
  };

  numberClickHandler = (number) => {
    this.setState({
      pressedNumber: number
    })
  }

  buyTicket = () => {
    const ticketNumber = this.state.pressedNumber;
    this.props.buyTicket(ticketNumber);
  };

  endGame = () => {
    this.props.endGame();
  };

  render() {
    return (
      <Segment textAlign='center'>
      <Header>
        Select a Ticket to buy
      </Header>
        <NumberGrid 
          numbers={this.state.numberGrid} 
          activeNumber={this.state.pressedNumber}
          onClick={this.numberClickHandler}
          />
        <Button secondary onClick={this.buyTicket}>Buy Ticket</Button>
        <Button secondary onClick={this.endGame}>End Game</Button>
      </Segment>
    );
  }
}

export default Game;
