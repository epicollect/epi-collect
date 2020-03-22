import React from 'react';
import {WizardRouteComponentProps} from './types';
import axios from "axios";

class Symptoms extends React.Component<WizardRouteComponentProps, {}> {

    constructor(props: WizardRouteComponentProps) {
        super(props);
    }

    handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        axios.post('/api/save', this.props.location.state)
            .then((res) => {
                this.props.history.push({
                    pathname: '/completed',
                    state: this.props.location.state
                })
            })
            .catch(function (error) {
                console.log(error);
            });
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