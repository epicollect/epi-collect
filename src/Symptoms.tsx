import React from 'react';
import {WizardRouteComponentProps} from './types';

class Symptoms extends React.Component<WizardRouteComponentProps, {}> {

    constructor(props: WizardRouteComponentProps) {
        super(props);
    }

    handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        this.props.history.push({
            pathname: '/completed',
            state: this.props.location.state
        })
    }

    render() {
        return (
            <div>
                <p>Indicate which symptoms you have</p>
                <a onClick={(e) => this.handleClick(e)}>Next</a>
            </div>
        )
    }
}

export default Symptoms;