import React from 'react';
import { Button, Container } from 'react-bootstrap';
import EngineerResults from './EngineerResults';
import NavBar from './NavBar';
import Nav from 'react-bootstrap/Nav';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import EngineerOverview from './EngineerOverview';
import { LinkContainer } from 'react-router-bootstrap';
import Settings from './Settings';
import usePrimeApp from '../hooks/usePrimeApp';

export default function App() {
  const { loading } = usePrimeApp();
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
