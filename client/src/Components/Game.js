import React, { Component } from "react";

import { Segment, Header, Input, Button } from "semantic-ui-react";

class Game extends Component {
  state = {
    number: ""
  }

  handleChange = (e) => {
    this.setState({
      number: e.target.value
    })
  }

  buyTicket = () => {
    const ticketNumber = this.state.number;
    this.props.buyTicket(ticketNumber);
  }

  render() {
    return (
      <Segment>
        <Header>Game Component</Header>
        <div>Grid of Numbers</div>
        <Input type="text" onChange={this.handleChange} placeholder='enter a number'/>
        <Button onClick={this.buyTicket}>Buy Ticket</Button>
      </Segment>
    )
  }

}

export default Game;
