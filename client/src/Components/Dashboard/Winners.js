import React from "react";

import { List, Icon } from "semantic-ui-react";

import { weiToEther } from "../../utils/conversion";

const winners = props => {
  return (
    <List divided relaxed>
      {props.previousWinners.map((winner, index) => (
        <List.Item key={winner.hash + index}>
          <List.Content>
            <List.Header
              style={{
                color: winner.hash === props.activeAccount ? "rgb(93, 133, 164)" : "rgba(0,0,0,.87)",
                overflowWrap: "break-word"
              }}
            >
              {winner.hash}
            </List.Header>
            <List.Description>
              {winner.hash === props.activeAccount ? "you " : null}won an amazing{" "}
              <strong>{weiToEther(winner.jackpot / winner.nrOfWinners)}</strong>
              <Icon name="ethereum" />
              in block #{winner.drawBlock}
            </List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

export default winners;
