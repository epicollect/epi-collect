import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './index.css';
import Upload from './Upload';
import SelectData from "./SelectData";
import * as serviceWorker from './serviceWorker';
import Completed from "./Completed";
import Symptoms from './Symptoms';

const routing = (
    <Router>
        <div>
            <Switch>
                <Route path="/upload" component={Upload}/>
                <Route path="/select-data" component={SelectData}/>
                <Route path="/symptoms" component={Symptoms}/>
                <Route path="/completed" component={Completed}/>
            </Switch>
        </div>
    </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
