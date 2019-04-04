import React from "react";

import Ticket from './Ticket';

import { Segment, Header } from "semantic-ui-react";

const tickets = props => (
  <Segment>
    <Header>Tickets Component</Header>
    <Ticket />
  </Segment>
);

export default tickets;
