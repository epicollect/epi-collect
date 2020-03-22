import React from 'react';
import {useRouteMatch} from "react-router-dom";

const Home = () => {

    let {path, url} = useRouteMatch();

    return (

        <h1>Home</h1>

    );
};

export default Home;