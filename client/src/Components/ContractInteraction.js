import React from 'react'

import { Button, Segment } from 'semantic-ui-react';

const contractInteraction = (props) => (
  <Segment>
    <Button primary onClick={props.sendMoneyToVault}>
      Send ETH
        </Button>
    <Button secondary onClick={props.getMoneyFromVault}>
      Request all ETH back
        </Button>
  </Segment>
)

export default contractInteraction;