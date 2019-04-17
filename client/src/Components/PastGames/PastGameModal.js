import React from "react";

import { Modal, Statistic, Icon, Header, Button } from "semantic-ui-react";

import { weiToEther } from "../../utils/conversion";

const pastGameModal = props => (
  <Modal trigger={<Button>more info</Button>}>
    <Modal.Content>
      <Statistic>
        <Statistic.Value>
          <Icon name="ethereum" /> {weiToEther(props.jackpot) || "0"}
        </Statistic.Value>
        <Statistic.Label>Jackpot</Statistic.Label>
      </Statistic>
      <Modal.Description>
        <Header>Some Header Text {props.index}</Header>
        <p>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet.
        </p>
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

export default pastGameModal;
