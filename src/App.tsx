import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import InfoPage from "./info_pages/InfoPage";
import Wizard from './wizard/Wizard';
import Upload from "./wizard/Upload";
import SelectData from "./wizard/SelectData";
import Symptoms from "./wizard/Symptoms";
import Confirm from "./wizard/Confirm";
import Completed from "./wizard/Completed";

const App = () => (
    <Router>
        <Switch>
            <Route path="/wizard" render={(props) => <Wizard {...props} steps={[
                {uri: '/wizard/upload', component: Upload, label: "Upload your data"},
                {uri: '/wizard/select-data', component: SelectData, label: "Review and filter data"},
                {uri: '/wizard/symptoms', component: Symptoms, label: "Add symptoms"},
                {uri: '/wizard/confirm', component: Confirm, label: "Confirm"},
                {uri: '/wizard/completed', component: Completed, label: "Completed"}
            ]}/>}/>
            <Route path="/" component={InfoPage}/>
        </Switch>
    </Router>
);

export default App;
