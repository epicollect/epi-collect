import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import InfoPage from "./info_pages/InfoPage";
import Wizard from './wizard/Wizard';

const App = () => (
    <Router>
        <Switch>
            <Route path="/wizard" component={Wizard}/>
            <Route path="/" component={InfoPage}/>
        </Switch>
    </Router>
);

export default App;
