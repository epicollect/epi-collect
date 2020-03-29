import React, {RefObject, useState} from 'react';
import {WizardStepProps} from '../types';
import {Redirect} from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import * as Yup from "yup";
import {ErrorMessage, Formik} from "formik";
import axios from "axios";
import {Button, ButtonGroup, ButtonToolbar, Form} from "react-bootstrap";

type EmailSignupFormValues = {
    email: string,
    add_to_mailing_list: boolean,
    token: string
}

type EmailSignupFormProps = {
    token: string,
    onDone: () => void
}


const EmailSignupForm = (props: EmailSignupFormProps) => {

    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const _recaptcha_ref: RefObject<ReCAPTCHA> = React.createRef();

    let initial_values: EmailSignupFormValues = {
        email: '',
        add_to_mailing_list: false,
        token: props.token
    };

    const validation_schema = Yup.object({
        email: Yup.string()
            .required('An email address is required to signup')
            .email('Please enter a valid email address'),
        add_to_mailing_list: Yup.boolean(),
        token: Yup.string().required()
    });


    const handleSubmitClick = (event: React.FormEvent) => {
        event.preventDefault();
        (_recaptcha_ref.current as ReCAPTCHA).execute();
    };

    const onCaptchaComplete = (submitForm: () => Promise<any>) => {
        return (captcha_token: string | null) => {
            setCaptchaToken(captcha_token);
            if (captcha_token !== null) {
                submitForm();
            }
        }
    }

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initial_values}
            validationSchema={validation_schema}
            onSubmit={(values, {setSubmitting, setErrors}) => {
                setSubmitting(true);
                const data = new FormData();
                data.append('email', values.email);
                data.append('add_to_mailing_list', values.add_to_mailing_list.toString());
                data.append('token', values.token);
                data.append('captcha_token', captchaToken as string);
                axios.post('/api/insert-email', data).then((res) => {
                    setSubmitting(false);
                    props.onDone();
                }).catch((error) => {
                    setSubmitting(false);
                    console.log(error.response);
                    (_recaptcha_ref.current as ReCAPTCHA).reset();
                });

            }}
        >
            {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  submitForm
              }) => (
                <Form onSubmit={handleSubmit} className="col-sm">

                    <Form.Group controlId="email">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control name="email"
                                      type="text"
                                      placeholder="name@example.com"
                                      value={values.email}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      size="lg"
                                      isValid={touched.email && !errors.email}
                                      isInvalid={touched.email && !!errors.email}/>
                        <ErrorMessage name="email"/>
                    </Form.Group>

                    <Form.Group controlId="add_to_mailing_list">
                        <Form.Check name="add_to_mailing_list"
                                    type="checkbox"
                                    label="I would like to subscribe to the mailing list"
                                    onChange={handleChange}
                                    onBlur={handleBlur}/>
                    </Form.Group>

                    <ReCAPTCHA
                        sitekey="6LfR2OQUAAAAAN0sXimMjxmbrpL2MPjyo1qqIfwG"
                        size="invisible"
                        onChange={onCaptchaComplete(submitForm)}
                        ref={_recaptcha_ref}
                    />

                    <input type="hidden" name="token" value={values.token}/>

                    <Form.Row className="float-right">
                        <ButtonToolbar>
                            <ButtonGroup>
                                <Button disabled={isSubmitting} variant="secondary"
                                        onClick={props.onDone}>Skip</Button>
                            </ButtonGroup>
                            <ButtonGroup className="col-md-1"/>
                            <ButtonGroup>
                                <Button type="submit" disabled={isSubmitting} variant="primary"
                                        onClick={handleSubmitClick}>Submit</Button>
                            </ButtonGroup>
                        </ButtonToolbar>
                    </Form.Row>
                </Form>
            )}
        </Formik>
    );
};

type CompletedState = {
    show_social: boolean
}

class Completed extends React.Component<WizardStepProps, CompletedState> {

    constructor(props: WizardStepProps) {
        super(props);
        this.state = {
            show_social: false
        }
    }

    render() {
        if ('token' in this.props.data
            && (this.props.data.token as string).length !== 0) {

            let main_content;
            if (this.state.show_social === true) {
                main_content = <div>Social buttons</div>;
            } else {
                main_content =
                    <EmailSignupForm token={this.props.data.token as string}
                                     onDone={() => this.setState({show_social: true})}/>
            }

            return (
                <div>
                    <p>All done!</p>
                    <p>Your token is:</p>
                    <pre>{this.props.data.token}</pre>
                    {main_content}
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