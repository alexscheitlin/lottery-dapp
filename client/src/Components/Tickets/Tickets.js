import React, { Component } from "react";

import Ticket from './Ticket';

import { Segment, Header, Card } from "semantic-ui-react";

class Tickets extends Component {

  render() {
    return (
      <Segment>
        <Card.Group>
        {
          this.props.tickets !== null ? 
            this.props.tickets.map((ticketNumbers, index) => {
              return (
                <Ticket
                  key={index}
                  index={index + 1}
                  numbers={ticketNumbers}
                />
              )
            }) :
            null
        }
        </Card.Group>
      </Segment>
    )
  }

}


export default Tickets;
