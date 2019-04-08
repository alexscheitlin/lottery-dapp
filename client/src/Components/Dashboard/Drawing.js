import React from 'react'

import { Statistic, Icon } from 'semantic-ui-react';

const drawing = (props) => {
  return (
    <Statistic.Group horizontal size='mini'>
      <Statistic>
        <Statistic.Value><Icon name='square outline' /> # {props.startBlock || 0}</Statistic.Value>
        <Statistic.Label>start block</Statistic.Label>
      </Statistic>
      <Statistic>
        <Statistic.Value><Icon name='square outline' /> # {props.currentBlock || 0}</Statistic.Value>
        <Statistic.Label>current block</Statistic.Label>
      </Statistic>
      <Statistic>
        <Statistic.Value><Icon name='square outline' /> # {props.endBlock || 0}</Statistic.Value>
        <Statistic.Label>next drawing</Statistic.Label>
      </Statistic>
    </Statistic.Group>
  )
}

export default drawing;