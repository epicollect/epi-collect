import React from 'react';
import {WizardStepProps} from '../types';
import {Redirect} from "react-router-dom";

class Completed extends React.Component<WizardStepProps, {}> {

    render() {
        if ('token' in this.props.data
            && (this.props.data.token as string).length !== 0) {
            return (
                <div>
                    <p>All done!</p>
                    <p>Your token is: <pre>{this.props.data.token}</pre></p>
                </div>
            )
        } else {
            return (
                <Redirect to="/wizard"/>
            )
        }
    }
}

export default Completed;