import React from 'react'
import { ErrorMessage, Formik, useField, useFormikContext } from 'formik'
import { Button, Form } from 'react-bootstrap'
import * as Yup from 'yup'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FormValues, WizardStepProps } from '../types'
import { Redirect } from 'react-router-dom'

type SelectField = {
  id: string
  name: string
}

type SelectOption = {
  id: number
  value: string
}

const DatePickerField = ({ ...props }) => {
  // @ts-ignore
  const { setFieldValue } = useFormikContext()
  // @ts-ignore
  const [field] = useField(props)
  return (
    <ReactDatePicker
      {...field}
      {...props}
      selected={(field.value && new Date(field.value)) || null}
      dateFormat="dd/MM/yyyy"
      wrapperClassName="form-control"
      className="form-control"
      onChange={(val) => {
        setFieldValue(field.name, val)
      }}
    />
  )
}

type SymptomsFormProps = {
  initialData?: FormValues
  onComplete: (values: FormValues) => void
}

const SymptomsForm = (props: SymptomsFormProps) => {
  // Questions and answers are based on WHO advice for countries reporting to WHO:
  // https://www.who.int/publications-detail/global-surveillance-for-human-infection-with-novel-coronavirus-(2019-ncov)
  // and https://www.worldometers.info/coronavirus/coronavirus-symptoms/#pre
  const preexisting_conditions: SelectField[] = [
    { id: 'cardiovascular', name: 'Cardiovascular disease (including hypertension)' },
    { id: 'diabetes', name: 'Diabetes' },
    { id: 'liver_disease', name: 'Liver disease' },
    { id: 'renal_disease', name: 'Chronic kidney disease (renal disease)' },
    {
      id: 'chronic_neurological_neuromuscular_disease',
      name: 'Chronic neurological or neuromuscular disease',
    },
    { id: 'cancer', name: 'Cancer' },
    { id: 'chronic_respiratory_disease', name: 'Chronic respiratory disease (COPD, asthma)' },
  ]
  const symptoms: SelectField[] = [
    { id: 'fever', name: 'Fever' },
    { id: 'cough', name: '(Dry) cough' },
    { id: 'myalgia_fatigue', name: 'Muscle pain or fatigue' },
    { id: 'sputum_production', name: 'Coughing up material' },
    { id: 'headache', name: 'Headache' },
    { id: 'haemoptysis', name: 'Coughing up blood' },
    { id: 'diarrhea', name: 'Diarrhea' },
    { id: 'shortness_of_breath', name: 'Shortness of breath' },
    { id: 'confusion', name: 'Confusion, dizziness or nausea' },
    { id: 'rhinorrhoea', name: 'Runny nose' },
    { id: 'chest_pain', name: 'Chest pain' },
    { id: 'vomiting', name: 'Vomiting' },
    { id: 'sore_throat', name: 'Sore throat' },
  ]
  const select_options: SelectOption[] = [
    { id: -1, value: '' },
    { id: 0, value: 'No' },
    { id: 1, value: 'Yes' },
  ]

  let initial_values: FormValues
  if (props.initialData !== undefined) {
    initial_values = props.initialData as FormValues
  } else {
    initial_values = {
      age: '',
      gender: '',
      has_symptoms: '',
      diagnosis: {
        covid19_diagnosed: '',
        covid19_diagnosed_date: '',
        first_symptoms_date: '',
        end_date: '',
      },
      symptoms: {},
      pregnancy: {
        currently_pregnant: '',
        pregnancy_trimester: '',
        post_partum: '',
      },
      has_preexisting_conditions: '',
      preexisting_conditions: {},
    }
  }

  // @ts-ignore
  preexisting_conditions.map(
    (condition) => (initial_values.preexisting_conditions[condition.id] = '')
  )
  // TODO: Simplify this
  const validate_preexisting_conditions = {}
  // @ts-ignore
  preexisting_conditions.map(
    (condition) => (validate_preexisting_conditions[condition.id] = Yup.number().min(0, 'Required'))
  )
  // @ts-ignore
  symptoms.map((symptom) => (initial_values.symptoms[symptom.id] = ''))
  // TODO: Simplify this
  const validate_symptoms = {}
  // @ts-ignore
  symptoms.map((symptom) => (validate_symptoms[symptom.id] = Yup.number().min(0, 'Required')))

  const validation_schema = Yup.object({
    age: Yup.number().min(18, 'Must be at least 18').required('Required'),
    gender: Yup.string(),
    has_symptoms: Yup.number(),
    diagnosis: Yup.object({
      covid19_diagnosed: Yup.number(),
      covid19_diagnosed_date: Yup.date().max(new Date(), 'Date must be in the past'),
      first_symptoms_date: Yup.date().max(new Date(), 'Date must be in the past'),
      end_date: Yup.date().max(new Date(), 'Date must be in the past'),
    }),
    symptoms: Yup.object(validate_symptoms),
    pregnancy: Yup.object({
      currently_pregnant: Yup.number(),
      pregnancy_trimester: Yup.string(),
      post_partum: Yup.number(),
    }),
    has_preexisting_conditions: Yup.number(),
    preexisting_conditions: Yup.object(validate_preexisting_conditions),
  })
  const handleDisplayChange = (section: string, inner_handler: (e: any) => void) => {
    return (e: React.ChangeEvent<any>) => {
      const value = parseInt(e.target.value, 10)
      const groups = document.querySelectorAll('.hide_' + section)
      if (value === 1) {
        for (let i = 0; i < groups.length; i++) {
          groups[i].classList.remove('d-none')
          groups[i].classList.add('d-block')
        }
      } else {
        for (let i = 0; i < groups.length; i++) {
          groups[i].classList.remove('d-block')
          groups[i].classList.add('d-none')
        }
      }
      inner_handler(e)
    }
  }

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initial_values}
      validationSchema={validation_schema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false)
        props.onComplete(values)
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="age">
            <Form.Label>Age</Form.Label>
            <Form.Control
              name="age"
              as="select"
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.age && errors.age ? 'is-invalid' : null}
            >
              <option value="" />
              {Array.apply(18, Array(130)).map(function (x, i) {
                return (
                  <option key={i} value={i}>
                    {i}
                  </option>
                )
              })}
            </Form.Control>
            <ErrorMessage name="age" />
          </Form.Group>

          <Form.Group controlId="gender">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              name="gender"
              as="select"
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.gender && errors.gender ? 'is-invalid' : null}
            >
              <option key="" value="" />
              <option key="female" value="female">
                Female
              </option>
              <option key="male" value="male">
                Male
              </option>
              <option key="other" value="other">
                Other
              </option>
            </Form.Control>
            <ErrorMessage name="gender" />
          </Form.Group>

          <Form.Group controlId="has_symptoms">
            <Form.Label>Do you currently have or have you had symptoms?</Form.Label>
            <Form.Control
              name="has_symptoms"
              as="select"
              onChange={handleDisplayChange('has_symptoms', handleChange)}
              onBlur={handleBlur}
              className={touched.has_symptoms && errors.has_symptoms ? 'is-invalid' : null}
            >
              {select_options.map((item, i) => (
                <option key={item.id} value={item.id}>
                  {item.value}
                </option>
              ))}
            </Form.Control>
            <ErrorMessage name="has_symptoms" />
          </Form.Group>

          <Form.Group controlId="diagnosis.covid19_diagnosed" className="d-none hide_has_symptoms">
            <Form.Label>Have you been diagnosed with COVID-19?</Form.Label>
            <Form.Control
              name="diagnosis.covid19_diagnosed"
              as="select"
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                touched['diagnosis.covid19_diagnosed'] && errors['diagnosis.covid19_diagnosed']
                  ? 'is-invalid'
                  : null
              }
            >
              {select_options.map((item, i) => (
                <option key={item.id} value={item.id}>
                  {item.value}
                </option>
              ))}
            </Form.Control>
            <ErrorMessage name="diagnosis.covid19_diagnosed" />
          </Form.Group>

          <Form.Group
            controlId="diagnosis.covid19_diagnosis_date"
            className="d-none hide_has_symptoms"
          >
            <Form.Label>If applicable, when were you diagnosed?</Form.Label>
            <DatePickerField
              name="diagnosis.covid19_diagnosis_date"
              maxDate={new Date()}
              value={values['diagnosis.covid19_diagnosis_date']}
            />
            <ErrorMessage name="diagnosis.covid19_diagnosis_date" />
          </Form.Group>

          <Form.Group
            controlId="diagnosis.first_symptoms_date"
            className="d-none hide_has_symptoms"
          >
            <Form.Label>When did you first get symptoms?</Form.Label>
            <DatePickerField
              name="diagnosis.first_symptoms_date"
              maxDate={new Date()}
              value={values['diagnosis.first_symptoms_date']}
            />
            <ErrorMessage name="diagnosis.first_symptoms_date" />
          </Form.Group>

          <Form.Group controlId="diagnosis.end_date">
            <Form.Label>If you've recovered, when did you recover?</Form.Label>
            <DatePickerField
              name="diagnosis.end_date"
              maxDate={new Date()}
              value={values['diagnosis.end_date']}
            />
            <ErrorMessage name="diagnosis.end_date" />
          </Form.Group>

          {symptoms.map((symptom, i) => (
            <Form.Group
              controlId={`symptoms.${symptom.id}`}
              key={`symptoms.${symptom.id}`}
              className="d-none hide_has_symptoms"
            >
              <Form.Label>{symptom.name}</Form.Label>
              <Form.Control
                name={`symptoms.${symptom.id}`}
                as="select"
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  touched[`symptoms.${symptom.id}`] && errors[`symptoms.${symptom.id}`]
                    ? 'is-invalid'
                    : null
                }
              >
                {select_options.map((item, i) => (
                  <option key={item.id} value={item.id}>
                    {item.value}
                  </option>
                ))}
              </Form.Control>
              <ErrorMessage name={`symptoms.${symptom.id}`} />
            </Form.Group>
          ))}

          <Form.Group controlId="pregnancy.currently_pregnant">
            <Form.Label>Are you currently pregnant?</Form.Label>
            <Form.Control
              name="pregnancy.currently_pregnant"
              as="select"
              onChange={handleDisplayChange('pregnancy', handleChange)}
              onBlur={handleBlur}
              className={
                touched['pregnancy.currently_pregnant'] && errors['pregnancy.currently_pregnant']
                  ? 'is-invalid'
                  : null
              }
            >
              {select_options.map((item, i) => (
                <option key={item.id} value={item.id}>
                  {item.value}
                </option>
              ))}
            </Form.Control>
            <ErrorMessage name="pregnancy.currently_pregnant" />
          </Form.Group>

          <Form.Group controlId="pregnancy.pregnancy_trimester" className="d-none hide_pregnancy">
            <Form.Label>In what stage is your pregnancy?</Form.Label>
            <Form.Control
              name="pregnancy.pregnancy_trimester"
              as="select"
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                touched['pregnancy.pregnancy_trimester'] && errors['pregnancy.pregnancy_trimester']
                  ? 'is-invalid'
                  : null
              }
            >
              <option key="" value="" />
              <option key="first_trimester" value="first_trimester">
                0-12 weeks
              </option>
              <option key="second_trimester" value="second_trimester">
                13-26 weeks
              </option>
              <option key="third_trimester" value="third_trimester">
                27 or more weeks
              </option>
            </Form.Control>
            <ErrorMessage name="pregnancy.pregnancy_trimester" />
          </Form.Group>

          <Form.Group controlId="pregnancy.post_partum">
            <Form.Label>Have you given birth in the last 6 weeks?</Form.Label>
            <Form.Control
              name="pregnancy.post_partum"
              as="select"
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                touched['pregnancy.post_partum'] && errors['pregnancy.post_partum']
                  ? 'is-invalid'
                  : null
              }
            >
              <option key="" value="" />
              <option key="1" value="1">
                Yes
              </option>
              <option key="0" value="0">
                No
              </option>
            </Form.Control>
            <ErrorMessage name="pregnancy.post_partum" />
          </Form.Group>

          <Form.Group controlId="has_preexisting_conditions">
            <Form.Label>Do you have any pre-existing medical conditions?</Form.Label>
            <Form.Control
              name="has_preexisting_conditions"
              as="select"
              onChange={handleDisplayChange('preexisting_conditions', handleChange)}
              onBlur={handleBlur}
              className={
                touched.has_preexisting_conditions && errors.has_preexisting_conditions
                  ? 'is-invalid'
                  : null
              }
            >
              {select_options.map((item, i) => (
                <option key={item.id} value={item.id}>
                  {item.value}
                </option>
              ))}
            </Form.Control>
            <ErrorMessage name="has_preexisting_conditions" />
          </Form.Group>

          {preexisting_conditions.map((condition, i) => (
            <Form.Group
              controlId={`preexisting_conditions.${condition.id}`}
              key={`preexisting_conditions.${condition.id}`}
              className="d-none hide_preexisting_conditions"
            >
              <Form.Label>{condition.name}</Form.Label>
              <Form.Control
                name={`preexisting_conditions.${condition.id}`}
                as="select"
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  touched[`preexisting_conditions.${condition.id}`] &&
                  errors[`preexisting_conditions.${condition.id}`]
                    ? 'is-invalid'
                    : null
                }
              >
                {select_options.map((item, i) => (
                  <option key={item.id} value={item.id}>
                    {item.value}
                  </option>
                ))}
              </Form.Control>
              <ErrorMessage name={`preexisting_conditions.${condition.id}`} />
            </Form.Group>
          ))}
          <Button type="submit" disabled={isSubmitting} variant="primary">
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  )
}

class Symptoms extends React.Component<WizardStepProps, {}> {
  handleComplete(values: FormValues) {
    this.props.data.user_data = values
    this.props.onNavigate(undefined, '/wizard/confirm', this.props.data)
  }

  render() {
    if (this.props.data.locations.length !== 0) {
      return (
        <div>
          <p>Indicate which symptoms you have</p>
          <SymptomsForm
            initialData={this.props.data.user_data}
            onComplete={(e) => this.handleComplete(e)}
          />
        </div>
      )
    } else {
      return <Redirect to="/wizard" />
    }
  }
}

export default Symptoms
