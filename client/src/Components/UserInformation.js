import React from "react";

import { Segment, Header, Icon, Label } from "semantic-ui-react";

const userInformation = props => {
  return (
    <Segment>
      <Header>Your Wallet</Header>
      <Segment>{props.accountNr}</Segment>
      <Label size='large'>
        <Icon name='money bill alternate' />
        {props.accountBalance} ETH
    </Label>
      <Label size='large'>
        <Icon name='lock' />
        {props.vaultBalance} ETH
    </Label>
    </Segment>
  );
};

export default userInformation;
