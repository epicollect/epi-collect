import React from 'react';
import {WizardStepProps} from '../types';

class Completed extends React.Component<WizardStepProps, {}> {

    constructor(props: WizardStepProps) {
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