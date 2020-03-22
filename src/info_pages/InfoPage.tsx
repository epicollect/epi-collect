import React from 'react';
import {Route, Switch, useRouteMatch} from "react-router-dom";
import Home from './Home';
import {Button, Container, Jumbotron, Nav, Navbar, Row} from "react-bootstrap";
import FAQ from './FAQ';
import {LinkContainer} from 'react-router-bootstrap';

const InfoPage = () => {

    let {path, url} = useRouteMatch();

    if (path === '/') {
        path = '';
    }

    return (

        <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">EpiCollect</Navbar.Brand>
                <Nav className="mr-auto">
                    <LinkContainer to="/">
                        <Nav.Link>Home</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/faq">
                        <Nav.Link>FAQ</Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar>
            <Jumbotron fluid>
                <Container>
                    <Switch>
                        <Route exact path={`${path}/`}>
                            <Row className="justify-content-center">
                                <h1 className="text-center">Donate your location data to help fight COVID-19</h1>
                            </Row>
                            <Row className="justify-content-center">
                                <LinkContainer to="/wizard">
                                    <Button variant="success" size="lg">Donate my data</Button>
                                </LinkContainer>
                            </Row>
                        </Route>
                        <Route path={`${path}/`}>
                            <Row className="justify-content-center">
                                <h3 className="text-center">Donate your location data to help fight COVID-19</h3>
                            </Row>
                            <Row className="justify-content-center">
                                <LinkContainer to="/wizard">
                                    <Button variant="success">Donate my data</Button>
                                </LinkContainer>
                            </Row>
                        </Route>
                    </Switch>
                </Container>
            </Jumbotron>
            <Container fluid>
                <Row className="justify-content-md-center">
                    <Switch>
                        <Route exact path={`${path}/`} component={Home}/>
                        <Route path={`${path}/faq`} component={FAQ}/>
                    </Switch>
                </Row>
            </Container>
        </>

    );
};

export default InfoPage;