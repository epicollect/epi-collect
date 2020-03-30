import React from 'react';
import { Button, Container, OverlayTrigger, Tooltip } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { FaQuestionCircle } from 'react-icons/fa';
import FAQ from './FAQ';
import './index.scss';
import HowDoesItWork from './HowDoesItWork';

// className="justify-content-center"

const Home = () => {
    return (
        <Container>
            <h1>
                This website allows you to anonymously donate your
                Google location data to COVID-19 research projects.
            </h1>
            <p>
                <LinkContainer to="/wizard">
                    <Button variant="primary" size="lg">Add my data</Button>
                </LinkContainer>
                <span className="dataPointsCount">
                    Data points: 0
                    <OverlayTrigger
                        overlay={
                            <Tooltip id="questionCircle">Last updated: 2020/03/30</Tooltip>
                        }
                        placement="bottom"
                    >
                        <span className="questionCircle"><FaQuestionCircle /></span>
                    </OverlayTrigger>
                </span>
            </p>
            <h3>How does it work?</h3>
            <HowDoesItWork />
            <h3>Frequently asked questions</h3>
            <FAQ />
        </Container>
    );
};

export default Home;