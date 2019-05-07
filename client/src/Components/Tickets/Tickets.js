import React, { Component } from "react";

import Ticket from './Ticket';

import { Segment, Card } from "semantic-ui-react";

class Tickets extends Component {

  render() {
    return (
      <Segment>
        <Card.Group>
        {
          this.props.tickets !== null ?
            this.props.tickets.length > 0 ?
              this.props.tickets.map((ticketNumbers, index) => {
                return (
                  <Ticket
                    key={index}
                    index={index + 1}
                    numbers={ticketNumbers}
                  />
                )
              })
            : <p>You have no tickets purchased for this game!</p>
          : null
        }
        </Card.Group>
      </Segment>
    )
  }

}


export default Tickets;
