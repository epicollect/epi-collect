import React from 'react';
import {FormValues, WizardStepProps} from '../types';
import {Redirect} from "react-router-dom";

class Completed extends React.Component<WizardStepProps, {}> {

    constructor(props: WizardStepProps) {
        super(props);
    }

    render() {
        if (this.props.data.locations.length !== 0
            && 'user_data' in this.props.data
            && Object.keys(this.props.data.user_data as FormValues).length !== 0) {
            return (
                <div>
                    <p>All done!</p>
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