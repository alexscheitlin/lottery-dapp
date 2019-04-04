import React from "react";

import { Icon, Statistic } from "semantic-ui-react";

const jackpot = props => {
  return (
    <Statistic>
      <Statistic.Value>
        <Icon name="ethereum" /> {props.jackpot || "0"}
      </Statistic.Value>
      <Statistic.Label>Jackpot</Statistic.Label>
    </Statistic>
  );
};

export default jackpot;
