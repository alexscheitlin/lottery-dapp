import React, { Component } from "react";

import {
  Modal,
  Statistic,
  Icon,
  Button,
  Header,
  Segment,
  Label,
  List
} from "semantic-ui-react";

import { weiToEther } from "../../utils/conversion";

export default class PastGameModal extends Component {
  _mounted = false;

  state = {
    winners: [],
    participants: []
  };

  loadMoreInformation = async gameIndex => {
    const participants = await this.props.getParticipants(gameIndex);
    if (this._mounted) {
      this.setState({
        participants
      });
    }

    const winners = await this.props.getWinners(gameIndex);
    if (this._mounted) {
      this.setState({
        winners
      });
    }
  };

  componentWillMount = () => {
    this._mounted = true;
  };

  componentWillUnmount = () => {
    this._mounted = false;
  };

  render() {
    const gameIndex = this.props.nrOfPastGames - 1 - this.props.index;
    const winners =
      this.props.numberOfWinners > 0 ? (
        <List divided verticalAlign="middle">
          {this.state.winners.map((winner, index) => (
            <List.Item key={winner}>
              <List.Content floated="right">
                +{" "}
                {weiToEther(this.props.jackpot / this.props.numberOfWinners) ||
                  "0"}{" "}
                <Icon name="ethereum" />
              </List.Content>
              <List.Content>{winner}</List.Content>
            </List.Item>
          ))}
        </List>
      ) : (
        <div>There were no winners</div>
      );

    return (
      <Modal
        trigger={
          <Button onClick={() => this.loadMoreInformation(gameIndex)}>
            more info
          </Button>
        }
        size="tiny"
      >
        <Modal.Content>
          <Statistic>
            <Statistic.Value>
              <Icon name="ethereum" /> {weiToEther(this.props.jackpot) || "0"}
            </Statistic.Value>
            <Statistic.Label>Jackpot</Statistic.Label>
          </Statistic>
          <Modal.Description>
            <Header>Winners</Header>
            {winners}
            <Header>Participants</Header>
            <List divided verticalAlign="middle">
              {this.state.participants.map((participant, index) => (
                <List.Item key={participant}>
                  <List.Content>{participant}</List.Content>
                </List.Item>
              ))}
            </List>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}
