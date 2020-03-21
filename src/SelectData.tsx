import React from 'react';
import {WizardRouteComponentProps} from './types';

class SelectData extends React.Component<WizardRouteComponentProps, {}> {

    constructor(props: WizardRouteComponentProps) {
        super(props);
    }

    handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        this.props.history.push({
            pathname: '/symptoms',
            state: this.props.location.state
        })
    }

    render() {
        return (
            <div>
                <p>Select on a map which of these {this.props.location.state.locations.length}
                    locations you want to submit</p>
                <a onClick={(e) => this.handleClick(e)}>Next</a>
            </div>
        )
    }
}

export default SelectData;