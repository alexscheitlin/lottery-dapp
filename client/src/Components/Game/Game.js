import React, { Component } from "react";

import NumberGrid from "./NumberGrid";

import { Segment, Header, Input, Button } from "semantic-ui-react";

class Game extends Component {
  state = {
    activeNumbers: []
  };

  numberClickHandler = (number) => {
    const activeNumbers = this.state.activeNumbers;
    const activeNumberIndex = activeNumbers.indexOf(number);

    if (activeNumberIndex !== -1) {
      activeNumbers.splice(activeNumberIndex, 1);
    } else {
      if (activeNumbers.length !== this.props.numbersPerTicket) {
        activeNumbers.push(number);
      }
    }

    this.setState({
      activeNumbers: activeNumbers
    });
  }

  buyTicket = () => {
    this.props.buyTicket(this.state.activeNumbers);
    this.setState({
      activeNumbers: []
    });
  };

  endGame = () => {
    this.props.endGame();
  };

  render() {
    return (
      <Segment textAlign='center'>
        <p>Please choose {this.props.numbersPerTicket} {this.props.numbersPerTicket===1 ? "number" : "numbers"}.</p>
        <NumberGrid 
          minNumber={this.props.minNumber}
          maxNumber={this.props.maxNumber}
          activeNumbers={this.state.activeNumbers}
          onClick={this.numberClickHandler}
          />
        <Button secondary onClick={this.buyTicket} disabled={this.state.activeNumbers === [] || this.props.gameEnded}>Buy Ticket</Button>
        <Button secondary onClick={this.endGame} disabled={!this.props.numberDrawable}>End Game</Button>
      </Segment>
    );
  }
}

export default Game;
