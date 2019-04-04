import React, { Component } from 'react'

import Dashboard from './Dashboard/Dashboard';
import Tickets from './Tickets/Tickets';
import Game from './Game';

import {Segment, Header} from 'semantic-ui-react';

class Lottery extends Component {

  render() {
    return (
      <Segment>
        <Header>Lottery</Header>
        <Dashboard />
        <Game />
        <Tickets />
      </Segment>
    )
  }

}

export default Lottery;
