import React from "react";

import { Icon } from "semantic-ui-react";

import "./Status.css";

const statusStyle = {
  textAlign: "right",
  marginBottom: "1em"
};

const status = props => {
  const ended = (
    <div style={statusStyle}>
      game finished <Icon color="red" name="circle" />
    </div>
  );

  const running = (
    <div style={statusStyle}>
      game running <Icon className="pulsate-fwd" color="green" name="circle" />
    </div>
  );

  return <div>{props.hasGameEnded ? ended : running}</div>;
};

export default status;
