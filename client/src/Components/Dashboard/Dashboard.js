import React from "react";

import Jackpot from "./Jackpot";
import Drawing from "./Drawing";
import Winners from "./Winners";
import Status from "./Status";

import { Segment, Grid } from "semantic-ui-react";

const dashboard = props => (
  <Segment>
    <Grid columns={3}>
      <Grid.Row>
        <Grid.Column verticalAlign="middle" textAlign="center">
          <Drawing
            startBlock={props.startBlock}
            currentBlock={props.currentBlock}
            endBlock={props.endBlock}
            drawBlock={props.drawBlock}
          />
        </Grid.Column>
        <Grid.Column verticalAlign="middle" textAlign="center">
          <Jackpot jackpot={props.jackpot} />
        </Grid.Column>
        <Grid.Column>
          <Grid.Row>
            <Grid.Column>
              <Status
                hasGameEnded={props.gameEnded}
                isNumberDrawable={props.isNumberDrawable}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Winners previousWinners={props.previousWinners} activeAccount={props.activeAccount}/>
            </Grid.Column>
          </Grid.Row>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Segment>
);

export default dashboard;
