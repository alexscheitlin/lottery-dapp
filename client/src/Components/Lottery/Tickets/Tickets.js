import React, { Component } from "react";

import Loading from "../../Loading";

import Ticket from './Ticket';
import getMockTickets from '../../../utils/getMockTickets';

import { Segment, Header, Form } from "semantic-ui-react";

class Tickets extends Component {

  state = {
    tickets: [],
    ticketsLoaded: false,
    showLoader:false
  }

  fetchTickets = async () => {
    this.setState({ showLoader: true });
    let tickets = await getMockTickets();
    this.setState({ tickets: tickets, ticketsLoaded: true, showLoader: false });
  }

  render() {
    return (
      <Segment>
        <Header>Tickets Component</Header>
        <Form onSubmit={this.fetchTickets}>
          <Form.Group>
            <Form.Input
              placeholder='Public Key...'
              name='public-key'
              width='6'
            />
            <Form.Button content='Show my Tickets' />
          </Form.Group>
        </Form>
        {
          this.state.ticketsLoaded ? 
            this.state.tickets.map((ticket, index) => {
              return (
                <Ticket
                  key={ticket.id}
                  index={ticket.id}
                  number={ticket.number}
                  price={ticket.price}
                />
              )
            }) :
            null
        }
        { this.state.showLoader ?
          <Loading message={"fetching your tickets...one moment please"} /> :
          null
        }
        

      </Segment>
    )
  }

}


export default Tickets;
