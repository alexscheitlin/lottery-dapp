import React from "react";

import PastGameModal from "./PastGameModal";
import { weiToEther } from "../../utils/conversion";

import { Grid, Card, Statistic, Icon, Label } from "semantic-ui-react";

const pastGame = props => (
  <Card fluid>
    <Card.Content>
      <Card.Header>
        {
          props.luckyNumbers.map((number) => {
            return (
              <Label
                circular
                style={{
                  backgroundColor: "rgb(93, 133, 164)",
                  color: "white"
                }}
                size="huge"
              >
                {number}
              </Label>
            )
          })
        }
        <Statistic floated="right" size="tiny">
          <Statistic.Value>
            <Icon name="ethereum" /> {weiToEther(props.jackpot) || "0"}
          </Statistic.Value>
          <Statistic.Label>Jackpot</Statistic.Label>
        </Statistic>
      </Card.Header>
      <Card.Description>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column textAlign="center">
              <Statistic size="tiny">
                <Statistic.Value>
                  {props.numberOfWinners || 0} <Icon name="winner" />
                </Statistic.Value>
                <Statistic.Label>Winners</Statistic.Label>
              </Statistic>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Statistic size="tiny">
                <Statistic.Value>
                  {props.numberOfParticipants || 0} <Icon name="users" />
                </Statistic.Value>
                <Statistic.Label>Participants</Statistic.Label>
              </Statistic>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column textAlign="center">
              <Statistic size="tiny">
                <Statistic.Value>
                  <Icon name="square outline" /> # {props.endBlock || 0}
                </Statistic.Value>
                <Statistic.Label>End Block</Statistic.Label>
              </Statistic>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Statistic size="tiny">
                <Statistic.Value>
                  <Icon name="square outline" /> # {props.drawBlock || 0}
                </Statistic.Value>
                <Statistic.Label>Draw Block</Statistic.Label>
              </Statistic>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column textAlign="center">
              <PastGameModal
                jackpot={props.jackpot}
                nrOfPastGames={props.nrOfPastGames}
                index={props.index}
                getParticipants={props.getParticipants}
                getWinners={props.getWinners}
                numberOfWinners={props.numberOfWinners}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Description>
    </Card.Content>
  </Card>
);

export default pastGame;
