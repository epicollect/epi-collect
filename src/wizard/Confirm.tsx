import React, { RefObject } from 'react'
import { FormValues, WizardStepProps } from '../types'
import { Redirect } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from 'axios'
import { Button, Table } from 'react-bootstrap'
import {SymptomQuestions, select_options, symptoms, preexisting_conditions, pregnancy_trimester_options, SelectOption} from './questions'

class Confirm extends React.Component<WizardStepProps, {}> {
  _recaptcha_ref: RefObject<any>

  constructor(props: WizardStepProps) {
    super(props)
    this._recaptcha_ref = React.createRef()
  }

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    this._recaptcha_ref.current.execute()
  }

  onCaptchaComplete = (captcha_token: string | null) => {
    if (captcha_token !== null) {
      (this._recaptcha_ref.current as ReCAPTCHA).reset();
      axios
        .post('/api/save', {
          locations: this.props.data.locations,
          user_data: this.props.data.user_data,
          captcha_token,
        })
        .then((res) => {
          this.props.onNavigate(undefined, '/wizard/completed', {
            locations: [],
            token: res.data.token,
          })
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }

  getText(id: string | number, options: SelectOption[]) {
    // @ts-ignore
    return options.find((elem) => typeof id === 'string' ? elem.id === parseInt(id, 10) : elem.id === id).value;
  }

  render() {
    if (
      this.props.data.locations.length !== 0 &&
      'user_data' in this.props.data &&
      Object.keys(this.props.data.user_data as FormValues).length !== 0
    ) {
      const data = this.props.data.user_data as FormValues;
      return (
        <div>
          <p>Please confirm that you want to submit the following data:</p>
          <Table size="sm" responsive striped bordered hover>
            <tbody>
              <tr>
                <td>Number of locations</td>
                <td>{this.props.data.locations.length}</td>
              </tr>
              {data.age === "" ? null :
              (<tr>
                <td>{SymptomQuestions.age}</td>
                <td>{data.age}</td>
              </tr>)}
              {data.gender === "" ? null :
              (<tr>
                <td>{SymptomQuestions.gender}</td>
                <td>{data.gender}</td>
              </tr>)}
              {(data.diagnosis as FormValues).covid19_diagnosed === "" ? null :
              (<tr>
                <td>{SymptomQuestions.diagnosis.covid19_diagnosed}</td>
                <td>{this.getText((data.diagnosis as FormValues).covid19_diagnosed as string, select_options)}</td>
              </tr>)}
              {(data.diagnosis as FormValues).covid19_diagnosed_date === "" ? null :
              (<tr>
                <td>{SymptomQuestions.diagnosis.covid19_diagnosed_date}</td>
                <td>{new Date((data.diagnosis as FormValues).covid19_diagnosed_date as string).toLocaleDateString()}</td>
              </tr>)}
              {(data.diagnosis as FormValues).first_symptoms_date === "" ? null :
              (<tr>
                <td>{SymptomQuestions.diagnosis.first_symptoms_date}</td>
                <td>{new Date((data.diagnosis as FormValues).first_symptoms_date as string).toLocaleDateString()}</td>
              </tr>)}
              {(data.diagnosis as FormValues).end_date === "" ? null :
              (<tr>
                <td>{SymptomQuestions.diagnosis.end_date}</td>
                <td>{new Date((data.diagnosis as FormValues).end_date as string).toLocaleDateString()}</td>
              </tr>)}
              {data.has_symptoms === "" ? null :
              (<tr>
                <td>{SymptomQuestions.has_symptoms}</td>
                <td>{this.getText(data.has_symptoms as string, select_options)}</td>
              </tr>)}
              {
                symptoms.map((symptom) =>
                  (data.symptoms as FormValues)[symptom.id] === "" ? null :
                  (<tr key={symptom.id}>
                    <td>{symptom.name}</td>
                    <td>{this.getText((data.symptoms as FormValues)[symptom.id] as string, select_options)}</td>
                  </tr>)
                )
              }
              {(data.pregnancy as FormValues).currently_pregnant === "" ? null :
              (<tr>
                <td>{SymptomQuestions.pregnancy.currently_pregnant}</td>
                <td>{this.getText((data.pregnancy as FormValues).currently_pregnant as string, select_options)}</td>
              </tr>)}
              {(data.pregnancy as FormValues).pregnancy_trimester === "" ? null :
              (<tr>
                <td>{SymptomQuestions.pregnancy.pregnancy_trimester}</td>
                <td>{this.getText((data.pregnancy as FormValues).pregnancy_trimester as string, pregnancy_trimester_options)}</td>
              </tr>)}
              {(data.pregnancy as FormValues).post_partum === "" ? null :
              (<tr>
                <td>{SymptomQuestions.pregnancy.post_partum}</td>
                <td>{this.getText((data.pregnancy as FormValues).post_partum as string, select_options)}</td>
              </tr>)}
              {data.has_preexisting_conditions === "" ? null :
              (<tr>
                <td>{SymptomQuestions.has_preexisting_conditions}</td>
                <td>{this.getText(data.has_preexisting_conditions as string, select_options)}</td>
              </tr>)}
              {
                preexisting_conditions.map((condition) =>
                  (data.preexisting_conditions as FormValues)[condition.id] === "" ? null :
                  (<tr key={condition.id}>
                    <td>{condition.name}</td>
                    <td>{this.getText((data.preexisting_conditions as FormValues)[condition.id] as string, select_options)}</td>
                  </tr>)
                )
              }
            </tbody>
          </Table>
          <ReCAPTCHA
            sitekey="6LfR2OQUAAAAAN0sXimMjxmbrpL2MPjyo1qqIfwG"
            size="invisible"
            onChange={this.onCaptchaComplete}
            ref={this._recaptcha_ref}
          />
          <Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => this.handleClick(e)}>
            Next
          </Button>
        </div>
      )
    } else {
      return <Redirect to="/wizard" />
    }
  }
}

export default Confirm
