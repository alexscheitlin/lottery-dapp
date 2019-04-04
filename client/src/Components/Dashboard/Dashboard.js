import React from 'react'

import Jackpot from './Jackpot';
import Drawing from './Drawing';
import Winnings from './Winnings';

import { Segment, Grid } from 'semantic-ui-react';

const dashboard = (props) => (
  <Segment>
    <Grid columns={3}>
      <Grid.Row>
        <Grid.Column>
        <Drawing />
        </Grid.Column>
        <Grid.Column textAlign='center'>
          <Jackpot jackpot={props.jackpot}/>
        </Grid.Column>
        <Grid.Column>
          <Winnings />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Segment>

)

export default dashboard;