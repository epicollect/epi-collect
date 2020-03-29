import React from 'react';
import { Button, Container, Tabs, Image } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import './styles.scss';

// className="justify-content-center"

const Home = () => {
    return (
        <Container>
            <h1>
                This website allows you to anonymously donate your
                Google location data to COVID-19 research projects.
            </h1>
            <LinkContainer to="/wizard">
                <Button variant="primary" size="lg">Donate my data</Button>
            </LinkContainer>
            <span>Donated data points: 0</span>
            
            <h3>How does it work?</h3>
            <div className="gifDemonstrationContainer">
                GIF here
            </div>

            <h3>FAQ</h3>

            <h3>Privacy</h3>
        </Container>
    );
};

export default Home;