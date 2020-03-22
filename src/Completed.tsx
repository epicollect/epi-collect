import React from 'react';
import {WizardRouteComponentProps} from './types';
import {Redirect} from "react-router-dom";

class Completed extends React.Component<WizardRouteComponentProps, {}> {

    constructor(props: WizardRouteComponentProps) {
        super(props);
    }

    render() {
        if (this.props.location.state !== undefined) {
            return (
                <div>
                    <p>All done!</p>
                </div>
            )
        } else {
            return (
                <Redirect to="/upload"/>
            )
        }
    }
}

export default Completed;