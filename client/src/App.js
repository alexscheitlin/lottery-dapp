import React, { Component } from "react";

// Router
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

// Views
import Home from "./Views/Home";
import History from "./Views/History";

import { Menu, Segment, Container, Icon, Header } from "semantic-ui-react";

class App extends Component {
  state = { activeItem: "" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <div>
        <Router>
          <Segment
            inverted
            textAlign="center"
            style={{ padding: "1em 0em" }}
            vertical
          >
            <Header as="h1" textAlign="center" icon>
              <Icon inverted name="gem" />
              Lottery dApp
              <Header.Subheader style={{ color: "white" }}>
                <pre>lose your money and make us rich</pre>
              </Header.Subheader>
            </Header>
            <Menu pointing secondary inverted size="large">
              <Container>
                <Menu.Item
                  name="home"
                  active={activeItem === "home"}
                  onClick={this.handleItemClick}
                  as={NavLink}
                  exact
                  to="/"
                />
                <Menu.Item
                  name="history"
                  active={activeItem === "history"}
                  onClick={this.handleItemClick}
                  as={NavLink}
                  to="/history"
                />
              </Container>
            </Menu>
          </Segment>

          <Route exact path="/" component={Home} />
          <Route path="/history" component={History} />
        </Router>
      </div>
    );
  }
}

export default App;
