import React from "react";

import { Modal, Statistic, Icon, Button } from "semantic-ui-react";

import { weiToEther } from "../../utils/conversion";

const pastGameModal = props => (
  <Modal trigger={<Button>more info</Button>} size='tiny'>
    <Modal.Content>
      <Statistic>
        <Statistic.Value>
          <Icon name="ethereum" /> {weiToEther(props.jackpot) || "0"}
        </Statistic.Value>
        <Statistic.Label>Jackpot</Statistic.Label>
      </Statistic>
      <Modal.Description>
        <p>
          This part here could be replaced with a list of the addresses of participants. Furthermore, we could list how much each address has won in this game.
        </p>
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

export default pastGameModal;
