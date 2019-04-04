import React from 'react'

import { Segment } from "semantic-ui-react";

const ticket = (props) => (
  <Segment>
    <div>Ticket #{props.index} | bought with <strong>number {props.number}</strong></div>
  </Segment>
)

export default ticket;