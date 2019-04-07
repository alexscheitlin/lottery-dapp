import React, { Component } from "react";

import NumberGrid from "./NumberGrid";

import { Segment, Header, Input, Button } from "semantic-ui-react";

class Game extends Component {
  state = {
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
        <NumberGrid 
          minNumber={this.props.minNumber}
          maxNumber={this.props.maxNumber}
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
