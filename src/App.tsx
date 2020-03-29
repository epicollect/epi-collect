import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './info_pages/Home';
import FAQ from './info_pages/FAQ';
import Delete from './info_pages/Delete';
import 'bootstrap/dist/css/bootstrap.min.css';
import Wizard from './wizard/Wizard';
import Upload from "./wizard/Upload";
import SelectData from "./wizard/SelectData";
import Symptoms from "./wizard/Symptoms";
import Confirm from "./wizard/Confirm";
import Completed from "./wizard/Completed";
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const App = () => (
    <Router>
        <Navbar>
            <Navbar.Brand href="/">Epi-Collect</Navbar.Brand>
            <Nav className="mr-auto">
                <LinkContainer exact to="/">
                    <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                <LinkContainer exact to="/donate">
                    <Nav.Link>Donate</Nav.Link>
                </LinkContainer>
                <LinkContainer exact to="/privacy">
                    <Nav.Link>GitHub</Nav.Link>
                </LinkContainer>
                <LinkContainer exact to="/delete">
                    <Nav.Link>Delete my data</Nav.Link>
                </LinkContainer>
            </Nav>
        </Navbar>
        <Switch>
            <Route path="/wizard" render={(props) => <Wizard {...props} steps={[
                {uri: '/wizard/upload', component: Upload, label: "Upload your data"},
                {uri: '/wizard/select-data', component: SelectData, label: "Review and filter data"},
                {uri: '/wizard/symptoms', component: Symptoms, label: "Add symptoms"},
                {uri: '/wizard/confirm', component: Confirm, label: "Confirm"},
                {uri: '/wizard/completed', component: Completed, label: "Completed"}
            ]}/>}/>
            <Route exact path="/" component={Home}/>
            <Route path="/faq" component={FAQ}/>
            <Route path="/delete" component={Delete}/>
        </Switch>
    </Router>
);

export default App;
