import React from "react";

import { Container, Header, Icon } from "semantic-ui-react";

const headerStyle = {
  backgroundColor: "#5d85a4",
  padding: "1rem",
  marginBottom: "1rem"
};

const siteHeader = () => (
  <Container fluid>
    <Header as="h1" textAlign="center" style={headerStyle} icon>
      <Icon inverted name="gem" />
      Lottery dApp
      <Header.Subheader>lose your money and make us rich</Header.Subheader>
    </Header>
  </Container>
);

export default siteHeader;
