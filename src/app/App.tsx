import React from 'react';
import { Container } from 'react-bootstrap';
import EngineerResults from '../features/engineer-result/EngineerResults';
import EngineerOverview from '../features/engineer-overview/EngineerOverview';
import Settings from '../features/settings/Settings';

import NavBar from './NavBar';
import Nav from 'react-bootstrap/Nav';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import useAppSideEffects from './useAppSideEffects';

export default function App() {
  const { loading } = useAppSideEffects();
  if (loading) {
    return <div>loading...</div>;
  }
  return (
    <Router>
      <NavBar title="devmgr">
        <Nav className="mr-auto">
          <LinkContainer to="/" exact>
            <Nav.Link>Overview</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/settings" exact>
            <Nav.Link>Settings</Nav.Link>
          </LinkContainer>
        </Nav>
      </NavBar>
      <Container>
        <Switch>
          <Route path="/user/:id">
            <EngineerResults />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/" exact>
            <EngineerOverview />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}
