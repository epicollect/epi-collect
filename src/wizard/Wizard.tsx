import {Redirect, Route, Switch} from "react-router-dom";
import React, {ComponentType} from "react";
import {Breadcrumb, Container, Row} from "react-bootstrap";
import {RouteComponentProps, StaticContext} from "react-router";
import {LinkContainer} from "react-router-bootstrap";
import {WizardState} from "../types";

type Step = {
    uri: string,
    component: ComponentType<RouteComponentProps<any>> | ComponentType<any>,
    label: string,
}

type WizardProps = {
    steps: Step[]
}

class Wizard extends React.Component<RouteComponentProps<{}, StaticContext, any> & WizardProps, WizardState> {

    constructor(props: RouteComponentProps<{}, StaticContext, any> & WizardProps) {
        super(props);
        this.state = {
            locations: []
        }
    }

    onNavigate = (event: React.SyntheticEvent<any> | undefined, uri: string, state: WizardState) => {
        if (event !== undefined) {
            event.preventDefault();
        }
        this.setState(state);
        this.props.history.push({
            pathname: uri
        });
    };

    render() {

        let {path} = this.props.match;
        let location = this.props.location;
        const { steps } = this.props;

        let seen_active = false;

        return (

            <>
                <Container>
                    <Row>
                        <Breadcrumb>
                            {this.props.steps.slice(0, steps.length - 1).map((step) => {
                                    if (step.uri === location.pathname) {
                                        // Current
                                        seen_active = true;
                                        return (
                                            <LinkContainer to={step.uri} key={step.uri}
                                                           onClick={(e) => this.onNavigate(e, step.uri, this.state)}>
                                                <Breadcrumb.Item className="completed">{step.label}</Breadcrumb.Item>
                                            </LinkContainer>
                                        )
                                    } else if (!seen_active) {
                                        // Before current
                                        return (
                                            <LinkContainer to={step.uri} key={step.uri}
                                                           onClick={(e) => this.onNavigate(e, step.uri, this.state)}>
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
                            {this.props.steps.map((step) => {
                                    return (
                                        <Route key={step.uri} path={step.uri} render={(props) => (
                                            React.createElement(step.component, Object.assign({}, props, {
                                                onNavigate: this.onNavigate,
                                                data: this.state
                                            }))
                                        )}/>
                                    )
                                }
                            )}
                        </Switch>
                    </Row>
                </Container>

            </>
        );
    }
}

export default Wizard;
