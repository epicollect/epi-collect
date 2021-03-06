import { Redirect, Route, Switch } from 'react-router-dom'
import React, { ComponentType } from 'react'
import { Breadcrumb, Container } from 'react-bootstrap'
import { RouteComponentProps, StaticContext } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { WizardState } from '../types'
import { Badge } from 'react-bootstrap'
import './styles.scss'

type Step = {
  uri: string
  component: ComponentType<RouteComponentProps<any>> | ComponentType<any>
  label: string
}

type WizardProps = {
  steps: Step[]
}

class Wizard extends React.Component<
  RouteComponentProps<{}, StaticContext, any> & WizardProps,
  WizardState
> {
  constructor(props: RouteComponentProps<{}, StaticContext, any> & WizardProps) {
    super(props)
    this.state = {
      locations: [],
    }
  }

  onNavigate = (event: React.SyntheticEvent<any> | undefined, uri: string, state: WizardState) => {
    if (event !== undefined) {
      event.preventDefault()
    }
    this.setState(state)
    this.props.history.push({
      pathname: uri,
    })
  }

  render() {
    const { path } = this.props.match
    const location = this.props.location
    const { steps } = this.props

    let seen_active = false

    return (
      <>
        <Container>
          <section>
            <Breadcrumb className="wizardBreadcrumb">
              {steps.slice(0, steps.length - 1).map((step, i) => {
                if (step.uri === location.pathname) {
                  // Current
                  seen_active = true
                  return (
                    <Breadcrumb.Item className="completed" key={step.uri + '-breadcrumb'}>
                      <LinkContainer
                        to={step.uri}
                        onClick={(e) => this.onNavigate(e, step.uri, this.state)}
                      >
                        <>
                          <Badge pill={true} variant="secondary">
                            {i + 1}
                          </Badge>
                          &nbsp;
                          {step.label}
                        </>
                      </LinkContainer>
                    </Breadcrumb.Item>
                  )
                } else if (!seen_active) {
                  // Before current
                  return (
                    <Breadcrumb.Item className="completed" key={step.uri + '-breadcrumb'}>
                      <LinkContainer
                        to={step.uri}
                        onClick={(e) => this.onNavigate(e, step.uri, this.state)}
                      >
                        <>
                          <Badge pill={true} variant="secondary">
                            {i + 1}
                          </Badge>
                          &nbsp;
                          {step.label}
                        </>
                      </LinkContainer>
                    </Breadcrumb.Item>
                  )
                } else {
                  // After current
                  return (
                    <Breadcrumb.Item active={true} key={step.uri + '-breadcrumb'}>
                      <>
                        <Badge pill={true} variant="secondary">
                          {i + 1}
                        </Badge>
                        &nbsp;
                        {step.label}
                      </>
                    </Breadcrumb.Item>
                  )
                }
              })}
            </Breadcrumb>
          </section>
          <section className="justify-content-md-center">
            <Switch>
              <Route key={''} exact={true} path={path}>
                <Redirect to={`${path}/upload`} />
              </Route>
              {this.props.steps.map((step) => {
                return (
                  <Route
                    key={step.uri}
                    path={step.uri}
                    render={(props) =>
                      React.createElement(
                        step.component,
                        Object.assign({}, props, {
                          onNavigate: this.onNavigate,
                          data: this.state,
                        })
                      )
                    }
                  />
                )
              })}
            </Switch>
          </section>
        </Container>
      </>
    )
  }
}

export default Wizard
