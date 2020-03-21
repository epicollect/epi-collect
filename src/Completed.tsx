import React from 'react';
import {WizardRouteComponentProps} from './types';

class Completed extends React.Component<WizardRouteComponentProps, {}> {

    constructor(props: WizardRouteComponentProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>All done!</p>
            </div>
        )
    }
}

export default Completed;