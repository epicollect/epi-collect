import React from 'react';
import {useRouteMatch} from "react-router-dom";

const FAQ = () => {

    let {path, url} = useRouteMatch();

    return (

        <h1>FAQ</h1>

    );
};

export default FAQ;