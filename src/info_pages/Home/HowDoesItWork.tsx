import React from 'react';
import './HowDoesItWork.scss';

const HowDoesItWork = () => (
    <>
        <div className="demonstrationContainer">
            <p className="gifPlaceholder">
                GIF here
            </p>
            <div className="stepsContainer">
                <ul>
                    <li>1. Export your data from Google</li>
                    <li>2. Filter your data</li>
                    <li>3. Answer an optional questionnaire</li>
                </ul>
            </div>
        </div>
    </>
)

export default HowDoesItWork;