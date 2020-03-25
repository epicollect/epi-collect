import React from 'react';
import {Location, WizardRouteComponentProps} from '../types';
import {Redirect} from 'react-router-dom';
import GeoMap from "./GeoMap";

type DataSelectorState = {};

class SelectData extends React.Component<WizardRouteComponentProps, DataSelectorState> {

    constructor(props: WizardRouteComponentProps) {
        super(props);
    }

    onDone = (locations: Location[]) => {
        const state = this.props.location.state;
        state.locations = locations;
        this.props.history.push({
            pathname: '/wizard/symptoms',
            state: this.props.location.state
        });
    };

    render() {
        if (this.props.location.state !== undefined) {
            return (
                <div>
                    <GeoMap locations={this.props.location.state.locations} onDone={this.onDone}/>

                </div>
            )
        } else {
            return (
                <Redirect to="/wizard"/>
            )
        }
    }
}

export default SelectData;