import {Redirect, Route, Switch, useLocation, useRouteMatch} from "react-router-dom";
import Upload from "./Upload";
import SelectData from "./SelectData";
import Symptoms from "./Symptoms";
import Completed from "./Completed";
import React, {ComponentType} from "react";
import {Breadcrumb, Container, Row} from "react-bootstrap";
import {RouteComponentProps} from "react-router";
import {LinkContainer} from "react-router-bootstrap";

type Step = {
    uri: string,
    component: ComponentType<RouteComponentProps<any>> | ComponentType<any>,
    label: string
}

const Wizard = () => {

    let {path, url} = useRouteMatch();
    let location = useLocation();

    const steps: Step[] = [
        {uri: `${path}/upload`, component: Upload, label: "Upload your data"},
        {uri: `${path}/select-data`, component: SelectData, label: "Review and filter data"},
        {uri: `${path}/symptoms`, component: Symptoms, label: "Add symptoms"},
        {uri: `${path}/completed`, component: Completed, label: "Confirmation"}
    ];

    let seen_active = false;

    return (

        <>
            <Container>
                <Row>
                    <Breadcrumb>
                        {steps.map((step) => {
                                if (step.uri === location.pathname) {
                                    // Current
                                    seen_active = true;
                                    return (
                                        <LinkContainer to={step.uri} key={step.uri}>
                                            <Breadcrumb.Item className="current" active>{step.label}</Breadcrumb.Item>
                                        </LinkContainer>
                                    )
                                } else if (!seen_active) {
                                    // Before current
                                    return (
                                        <LinkContainer to={step.uri} key={step.uri}>
                                            <Breadcrumb.Item className="completed">{step.label}</Breadcrumb.Item>
                                        </LinkContainer>
                                    )
                                } else {
                                    // After current
                                    return (
                                        <Breadcrumb.Item active key={step.uri}>{step.label}</Breadcrumb.Item>
                                    )
                                }
                            }
                        )}
                    </Breadcrumb>
                </Row>
                <Row className="justify-content-md-center">
                    <Switch>
                        <Route key={""} exact path={path}>
                            <Redirect to={`${path}/upload`}/>
                        </Route>
                        {steps.map((step) => {
                                return (
                                    <Route key={step.uri} path={step.uri} component={step.component}/>
                                )
                            }
                        )}
                    </Switch>
                </Row>
            </Container>

        </>
    );
}

export default Wizard;
