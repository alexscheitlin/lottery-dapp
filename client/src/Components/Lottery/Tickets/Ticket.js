import React from 'react'

import { Segment } from "semantic-ui-react";

const ticket = (props) => (
  <Segment>
    <div>Ticket #{props.index} | bought for <strong>number {props.number}</strong></div>
  </Segment>
)

export default ticket;