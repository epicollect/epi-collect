import React, { RefObject, useState } from 'react'
import { WizardStepProps } from '../types'
import { Redirect } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import * as Yup from 'yup'
import { ErrorMessage, Formik } from 'formik'
import axios from 'axios'
import { Button, ButtonGroup, ButtonToolbar, Col, Form, Row } from 'react-bootstrap'
// @ts-ignore
import { Facebook, HackerNews, Linkedin, Mail, Reddit, Twitter } from 'react-social-sharing'
import { LinkContainer } from 'react-router-bootstrap'

type EmailSignupFormValues = {
  email: string
  add_to_mailing_list: boolean
  token: string
}

type EmailSignupFormProps = {
  token: string
  onDone: () => void
}

const EmailSignupForm = (props: EmailSignupFormProps) => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const _recaptcha_ref: RefObject<ReCAPTCHA> = React.createRef()

  const initial_values: EmailSignupFormValues = {
    email: '',
    add_to_mailing_list: false,
    token: props.token,
  }

  const validation_schema = Yup.object({
    email: Yup.string()
      .required('An email address is required to signup')
      .email('Please enter a valid email address'),
    add_to_mailing_list: Yup.boolean(),
    token: Yup.string().required(),
  })

  const handleSubmitClick = (event: React.FormEvent) => {
    event.preventDefault()
    ;(_recaptcha_ref.current as ReCAPTCHA).execute()
  }

  const onCaptchaComplete = (submitForm: () => Promise<any>) => {
    return (captcha_token: string | null) => {
      setCaptchaToken(captcha_token)
      if (captcha_token !== null) {
        submitForm()
      }
    }
  }

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initial_values}
      validationSchema={validation_schema}
      onSubmit={(values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        const data = new FormData()
        data.append('email', values.email)
        data.append('add_to_mailing_list', values.add_to_mailing_list.toString())
        data.append('token', values.token)
        data.append('captcha_token', captchaToken as string)
        axios
          .post('/api/insert-email', data)
          .then((res) => {
            setSubmitting(false)
            props.onDone()
          })
          .catch((error) => {
            setSubmitting(false)
            console.log(error.response)
            ;(_recaptcha_ref.current as ReCAPTCHA).reset()
          })
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
        submitForm,
      }) => (
        <Form onSubmit={handleSubmit} className="col-sm">
          <Form.Group controlId="email">
            <Form.Label>E-mail</Form.Label>
            <Form.Control
              name="email"
              type="text"
              placeholder="name@example.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              size="lg"
              isValid={touched.email && !errors.email}
              isInvalid={touched.email && !!errors.email}
            />
            <ErrorMessage name="email" />
          </Form.Group>

          <Form.Group controlId="add_to_mailing_list">
            <Form.Check
              name="add_to_mailing_list"
              type="checkbox"
              label="I would like to subscribe to the mailing list"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Group>

          <ReCAPTCHA
            sitekey="6LfR2OQUAAAAAN0sXimMjxmbrpL2MPjyo1qqIfwG"
            size="invisible"
            onChange={onCaptchaComplete(submitForm)}
            ref={_recaptcha_ref}
          />

          <input type="hidden" name="token" value={values.token} />

          <Form.Row className="float-right">
            <ButtonToolbar>
              <ButtonGroup>
                <Button disabled={isSubmitting} variant="secondary" onClick={props.onDone}>
                  Skip
                </Button>
              </ButtonGroup>
              <ButtonGroup className="col-md-1" />
              <ButtonGroup>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="primary"
                  onClick={handleSubmitClick}
                >
                  Submit
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Form.Row>
        </Form>
      )}
    </Formik>
  )
}

type SocialSharingProps = {
  link: string
  text: string
  email_subject: string
}

const SocialSharing = (props: SocialSharingProps) => {
  return (
    <>
      <p>Help us spread the word about Epi-Collect!</p>
      <Row>
        <Col>
          <Twitter solid={true} medium={true} message={props.text} link={props.link} />
        </Col>
        <Col>
          <Facebook solid={true} medium={true} link={props.link} />
        </Col>
        <Col>
          <Mail
            solid={true}
            medium={true}
            subject={props.email_subject}
            body={props.text + ' ' + props.link}
          />
        </Col>
        <Col>
          <Linkedin solid={true} medium={true} message={props.text} link={props.link} />
        </Col>
        <Col>
          <Reddit solid={true} medium={true} link={props.link} />
        </Col>
        <Col>
          <HackerNews solid={true} medium={true} message={props.text} link={props.link} />
        </Col>
      </Row>
      <LinkContainer to="/">
        <Button variant="secondary">Back to home</Button>
      </LinkContainer>
    </>
  )
}

type CompletedState = {
  show_social: boolean
  no_valid_data: boolean
  social_text: string
}

class Completed extends React.Component<WizardStepProps, CompletedState> {
  constructor(props: WizardStepProps) {
    super(props)
    // If no_valid_data is set, the user had no data left after filtering, and was redirected here directly.
    // In that case just show the social buttons with a custom text.
    const no_valid_data =
      'no_valid_data' in this.props.data && this.props.data.no_valid_data === true
    this.state = {
      show_social: no_valid_data,
      no_valid_data,
      social_text: no_valid_data
        ? 'Help research into COVID-19 by donating your location data!'
        : "I've just donated my data to Epi-Collect to help research into COVID-19, donate yours too!",
    }
  }

  render() {
    if (
      this.state.no_valid_data ||
      ('token' in this.props.data && (this.props.data.token as string).length !== 0)
    ) {
      let token_content
      if (this.state.no_valid_data === true) {
        token_content = (
          <p>
            Unfortunately your Google Takeout data doesn't contain any data in the COVID-19 outbreak
            period, so we are unable to use it. However, please do feel free to share this project
            on social media.
          </p>
        )
      } else {
        token_content = (
          <>
            <p>All done!</p>
            <p>Your token is:</p>
            <pre>{this.props.data.token}</pre>
          </>
        )
      }

      let main_content
      if (this.state.show_social === true) {
        main_content = (
          <SocialSharing
            link="https://epi-collect.org"
            text={this.state.social_text}
            email_subject="Donating your data to help research into COVID-19"
          />
        )
      } else {
        main_content = (
          <EmailSignupForm
            token={this.props.data.token as string}
            onDone={() => this.setState({ show_social: true })}
          />
        )
      }

      return (
        <div>
          {token_content}
          {main_content}
        </div>
      )
    } else {
      return <Redirect to="/wizard" />
    }
  }
}

export default Completed
