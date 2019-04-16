import React, { Component } from "react";

// Router
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// Views
import Home from "./Views/Home";
import History from "./Views/History";

// Components
import SiteHeader from "./Components/shared/SiteHeader";

import { Menu, Segment, Container } from "semantic-ui-react";

class App extends Component {
  state = { activeItem: "home" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <div>
        <Router>
          <SiteHeader />

          <Container text>
            <Menu pointing secondary>
              <Menu.Item
                name="home"
                active={activeItem === "home"}
                onClick={this.handleItemClick}
                as={Link}
                to="/"
              />
              <Menu.Item
                name="history"
                active={activeItem === "history"}
                onClick={this.handleItemClick}
                as={Link}
                to="/history"
              />
            </Menu>
          </Container>

          <Route exact path="/" component={Home} />
          <Route path="/history" component={History} />
        </Router>
      </div>
    );
  }
}

export default App;
