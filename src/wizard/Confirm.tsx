import React, {RefObject} from 'react';
import {FormValues, WizardStepProps} from '../types';
import {Redirect} from "react-router-dom";
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';

class Confirm extends React.Component<WizardStepProps, {}> {
    _recaptcha_ref: RefObject<any>;

    constructor(props: WizardStepProps) {
        super(props);
        this._recaptcha_ref = React.createRef();
    }

    handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        this._recaptcha_ref.current.execute();
    }

    onCaptchaComplete = (captcha_token: string | null) => {
        if (captcha_token !== null) {
            (this._recaptcha_ref.current as ReCAPTCHA).reset();
            axios.post('/api/save', {
                locations: this.props.data.locations,
                user_data: this.props.data.user_data,
                captcha_token: captcha_token
            })
                .then((res) => {
                    this.props.onNavigate(undefined, '/wizard/completed',
                        {locations: [], token: res.data['token']});
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    render() {
        if (this.props.data.locations.length !== 0
            && 'user_data' in this.props.data
            && Object.keys(this.props.data.user_data as FormValues).length !== 0) {
            return (
                <div>
                    <p>Please confirm TODO</p>
                    <ReCAPTCHA
                        sitekey="6LfR2OQUAAAAAN0sXimMjxmbrpL2MPjyo1qqIfwG"
                        size="invisible"
                        onChange={this.onCaptchaComplete}
                        ref={this._recaptcha_ref}
                    />
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