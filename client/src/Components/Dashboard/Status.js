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
      game finished, please initiate payout <Icon color="red" name="circle" />
    </div>
  );

  const drawing = (
    <div style={statusStyle}>
      drawing numbers <Icon className="pulsate-fwd" color="orange" name="circle" />
    </div>
  );

  const running = (
    <div style={statusStyle}>
      game running <Icon className="pulsate-fwd" color="green" name="circle" />
    </div>
  );

  if (props.hasGameEnded && props.isNumberDrawable) {
    return ended;
  } else if (props.hasGameEnded) {
    return drawing;
  } else {
    return running;
  }
};

export default status;
