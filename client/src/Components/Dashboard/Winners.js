import React from "react";

import { List, Icon } from "semantic-ui-react";

import { weiToEther } from "../../utils/conversion";

const winners = props => {
  const highlight = {
    color: "rgb(93, 133, 164)"
  };
  return (
    <List divided relaxed>
      {props.previousWinners.map((winner, index) => (
        <List.Item key={winner.hash + index}>
          <List.Content>
            <List.Header
              style={winner.hash === props.activeAccount ? highlight : null}
            >
              {winner.hash}
            </List.Header>
            <List.Description>
              an amazing {weiToEther(winner.jackpot / winner.nrOfWinners)}{" "}
              <Icon name="ethereum" /> in block #{winner.drawBlock}
            </List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

export default winners;
