import React from 'react';
import {FormValues, WizardStepProps} from '../types';
import {Redirect} from "react-router-dom";
import axios from "axios";

class Confirm extends React.Component<WizardStepProps, {}> {

    constructor(props: WizardStepProps) {
        super(props);
    }

    handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        axios.post('/api/save', {
            locations: this.props.data.locations,
            user_data: this.props.data.user_data
        })
            .then((res) => {
                this.props.onNavigate(undefined, '/wizard/completed', {locations: []});
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        if (this.props.data.locations.length !== 0
            && 'user_data' in this.props.data
            && Object.keys(this.props.data.user_data as FormValues).length !== 0) {
            return (
                <div>
                    <p>Please confirm TODO</p>
                    <a onClick={(e) => this.handleClick(e)}>Next</a>
                </div>
            )
        } else {
            return (
                <Redirect to="/wizard"/>
            )
        }
    }
}

export default Confirm;