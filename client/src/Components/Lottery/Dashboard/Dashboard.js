import React from 'react'

import Jackpot from './Jackpot';
import Drawing from './Drawing';
import Winnings from './Winnings';

import { Segment, Header } from 'semantic-ui-react';

const dashboard = (props) => (
  <Segment>
    <Header>Dashboard Component</Header>
    <Jackpot />
    <Drawing />
    <Winnings />
  </Segment>

)

export default dashboard;