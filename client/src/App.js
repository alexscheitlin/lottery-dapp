import React from "react";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// Views
import Home from "./Views/Home";
import History from "./Views/History";
// Components
import SiteHeader from "./Components/shared/SiteHeader";

const app = () => {
  return (
    <div>
      <SiteHeader />
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/history">History</Link>
            </li>
          </ul>

          <hr />

          <Route exact path="/" component={Home} />
          <Route path="/history" component={History} />
        </div>
      </Router>
    </div>
  );
};

export default app;
