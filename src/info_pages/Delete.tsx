import React, {RefObject, useState} from 'react';
import * as Yup from "yup";
import {ErrorMessage, Formik} from "formik";
import {Button, Form, Row} from "react-bootstrap";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";


type DeleteDataFormValues = {
    token: string
}

type DeleteDataFormProps = {}


const DeleteDataForm = (props: DeleteDataFormProps) => {

    const [completed, setCompleted] = useState<boolean>(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const _recaptcha_ref: RefObject<ReCAPTCHA> = React.createRef();

    let initial_values: DeleteDataFormValues = {
        token: ''
    };

    const validation_schema = Yup.object({
        token: Yup.string()
            .required('Please type your token in the input field')
            .test('num_words',
                'A token must consist of exactly six words',
                (val: string | undefined) => val !== undefined
                    && val.split(' ').length === 6
                    && val.split(' ').every((word: string) => word !== '')
            )
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

    if (completed) {
        return (
            <p>All your data is deleted.</p>
        )
    } else {
        return (
            <Formik
                enableReinitialize={true}
                initialValues={initial_values}
                validationSchema={validation_schema}
                onSubmit={(values, {setSubmitting, setErrors}) => {
                    setSubmitting(true);
                    const data = new FormData();
                    data.append('token', values.token);
                    data.append('captcha_token', captchaToken as string);
                    axios.post('/api/delete', data).then((res) => {
                        setSubmitting(false);
                        setCompleted(true);
                    }).catch((error) => {
                        setSubmitting(false);
                        console.log(error.response);
                        (_recaptcha_ref.current as ReCAPTCHA).reset();
                        setErrors({'token': 'Invalid token'})
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

                        <Form.Group controlId="token">
                            <Form.Label>Token
                            </Form.Label>
                            <Form.Control name="token"
                                          type="text"
                                          placeholder="your token consisting of six words"
                                          value={values.token}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          size="lg"
                                          isValid={touched.token && !errors.token}
                                          isInvalid={touched.token && !!errors.token}/>
                            <ErrorMessage name="token"/>
                        </Form.Group>

                        <ReCAPTCHA
                            sitekey="6LfR2OQUAAAAAN0sXimMjxmbrpL2MPjyo1qqIfwG"
                            size="invisible"
                            onChange={onCaptchaComplete(submitForm)}
                            ref={_recaptcha_ref}
                        />

                        <Button type="submit" disabled={isSubmitting} variant="primary"
                                onClick={handleSubmitClick}>Submit</Button>
                    </Form>
                )}
            </Formik>
        );
    }
};

const Delete = () => {

    return (
        <>
            <Row className="justify-content-center">
                <h1>Delete my data</h1>
            </Row>
            <Row className="justify-content-center">
                <DeleteDataForm/>
            </Row>
        </>


    );
};

export default Delete;