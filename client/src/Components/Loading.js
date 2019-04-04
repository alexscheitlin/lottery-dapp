import React from "react";
import { Message, Icon } from "semantic-ui-react";

const loading = (props) => (
  <Message icon>
    <Icon name="circle notched" loading />
    <Message.Content>
      <Message.Header>Just one second</Message.Header>
      {props.message}
    </Message.Content>
  </Message>
);

export default loading;
