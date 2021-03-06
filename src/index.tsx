import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App";
import * as serviceWorker from './serviceWorker';
import * as Sentry from '@sentry/browser';
import ReactGA from 'react-ga';

import './styles.scss';

Sentry.init({dsn: "https://5f0ebb4296f04182a271364dc69c5b9c@sentry.io/5178703"});

ReactGA.initialize('UA-162057967-1');
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
