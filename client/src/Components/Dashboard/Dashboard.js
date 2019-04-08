import React from 'react'

import Jackpot from './Jackpot';
import Drawing from './Drawing';
import Winnings from './Winnings';
import Status from './Status';

import { Segment, Grid } from 'semantic-ui-react';

const dashboard = (props) => (
  <Segment>
    <Grid columns={3}>
      <Grid.Row>
        <Grid.Column verticalAlign='middle' textAlign='center'>
          <Drawing startBlock={props.startBlock} currentBlock={props.currentBlock} endBlock={props.endBlock} />
        </Grid.Column>
        <Grid.Column verticalAlign='middle' textAlign='center'>
          <Jackpot jackpot={props.jackpot} />
        </Grid.Column>
        <Grid.Column>
          <Status />
          <Winnings />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Segment>

)

export default dashboard;