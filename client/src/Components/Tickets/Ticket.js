import React from 'react'

import { Card, Label } from "semantic-ui-react";

const ticket = (props) => {
  const cardStyle = {
    borderRadius: '0'
  }

  const labelStyle = {
    backgroundColor: 'rgb(93, 133, 164)',
    color: 'white'
  }

  const indexStyle = {
    position: 'absolute',
    left: '1em',
    top: '0.5em'
  }
  return (
    <Card style={cardStyle}>
      <Card.Content textAlign='center'>
        <span style={indexStyle}># {props.index}</span>
        {
          props.numbers.map((number, index) => {
            return (
              <Label circular style={labelStyle} size='massive' key={index}>{number}</Label>
            )
          })
        }
      </Card.Content>
    </Card>
  )
}

export default ticket;