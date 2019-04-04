import React, { Component } from "react";

import Ticket from './Ticket';

import { Segment, Header } from "semantic-ui-react";

class Tickets extends Component {

  render() {
    return (
      <Segment>
        <Header>Tickets for this account</Header>
        {
          this.props.tickets !== null ? 
            this.props.tickets.map((ticket, index) => {
              return (
                <Ticket
                  key={index}
                  index={index + 1}
                  number={ticket}
                />
              )
            }) :
            null
        }
      </Segment>
    )
  }

}


export default Tickets;
