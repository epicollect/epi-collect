import React from 'react';
import {ErrorMessage, Field, Form, Formik, useField, useFormikContext} from "formik";
import * as Yup from 'yup';
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {FormValues, WizardRouteComponentProps} from "../types";
import axios from 'axios';
import {Redirect} from "react-router-dom";

type SelectField = {
    id: string;
    name: string;
}

type SelectOption = {
    id: number;
    value: string;
}

const DatePickerField = ({...props}) => {
    // @ts-ignore
    const {setFieldValue} = useFormikContext();
    // @ts-ignore
    const [field] = useField(props);
    return (
        <ReactDatePicker
            {...field}
            {...props}
            selected={(field.value && new Date(field.value)) || null}
            dateFormat="dd/MM/yyyy"
            onChange={val => {
                setFieldValue(field.name, val);
            }}
        />
    );
};

type SymptomsFormProps = {
    initialData?: FormValues,
    onComplete: (values: FormValues) => void;
}

const SymptomsForm = (props: SymptomsFormProps) => {

    // Questions and answers are based on WHO advice for countries reporting to WHO:
    // https://www.who.int/publications-detail/global-surveillance-for-human-infection-with-novel-coronavirus-(2019-ncov)
    // and https://www.worldometers.info/coronavirus/coronavirus-symptoms/#pre
    const preexisting_conditions: SelectField[] = [
            {id: 'cardiovascular', name: 'Cardiovascular disease (including hypertension)'},
            {id: 'diabetes', name: 'Diabetes'},
            {id: 'liver_disease', name: 'Liver disease'},
            {id: 'renal_disease', name: 'Chronic kidney disease (renal disease)'},
            {id: 'chronic_neurological_neuromuscular_disease', name: 'Chronic neurological or neuromuscular disease'},
            {id: 'cancer', name: 'Cancer'},
            {id: 'chronic_respiratory_disease', name: 'Chronic respiratory disease (COPD, asthma)'},
        ]
    ;

    const symptoms: SelectField[] = [
            {id: 'fever', name: 'Fever'},
            {id: 'cough', name: '(Dry) cough'},
            {id: 'myalgia_fatigue', name: 'Muscle pain or fatigue'},
            {id: 'sputum_production', name: 'Coughing up material'},
            {id: 'headache', name: 'Headache'},
            {id: 'haemoptysis', name: 'Coughing up blood'},
            {id: 'diarrhea', name: 'Diarrhea'},
            {id: 'shortness_of_breath', name: 'Shortness of breath'},
            {id: 'confusion', name: 'Confusion, dizziness or nausea'},
            {id: 'rhinorrhoea', name: 'Runny nose'},
            {id: 'chest_pain', name: 'Chest pain'},
            {id: 'vomiting', name: 'Vomiting'},
            {id: 'sore_throat', name: 'Sore throat'},
        ]
    ;

    const select_options: SelectOption[] = [
        {id: -1, value: ''},
        {id: 0, value: 'No'},
        {id: 1, value: 'Yes'}
    ];

    let initial_values: FormValues;
    if (props.initialData !== undefined) {
        initial_values = props.initialData as FormValues;
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
            preexisting_conditions: {}
        };
    }

    // @ts-ignore
    preexisting_conditions.map(condition => initial_values.preexisting_conditions[condition.id] = '');
    // TODO: Simplify this
    let validate_preexisting_conditions = {};
    // @ts-ignore
    preexisting_conditions.map(condition => validate_preexisting_conditions[condition.id] = Yup.number().min(0, 'Required'));
    // @ts-ignore
    symptoms.map(symptom => initial_values.symptoms[symptom.id] = '');
    // TODO: Simplify this
    let validate_symptoms = {};
    // @ts-ignore
    symptoms.map(symptom => validate_symptoms[symptom.id] = Yup.number().min(0, 'Required'));

    const validation_schema = Yup.object({
            age: Yup.number()
                .min(18, 'Must be at least 18')
                .required('Required'),
            gender: Yup.string(),
            has_symptoms: Yup.number(),
            diagnosis: Yup.object({
                covid19_diagnosed: Yup.number(),
                covid19_diagnosed_date: Yup.date().max(new Date(), 'Date must be in the past'),
                first_symptoms_date: Yup.date().max(new Date(), 'Date must be in the past'),
                end_date: Yup.date().max(new Date(), 'Date must be in the past')
            }),
            symptoms: Yup.object(validate_symptoms),
            pregnancy: Yup.object({
                currently_pregnant: Yup.number(),
                pregnancy_trimester: Yup.string(),
                post_partum: Yup.number(),
            }),
            has_preexisting_conditions: Yup.number(),
            preexisting_conditions: Yup.object(validate_preexisting_conditions)
        })
    ;

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initial_values}
            validationSchema={validation_schema}
            onSubmit={(values, {setSubmitting}) => {
                setSubmitting(false);
                props.onComplete(values);
            }}
        >
            <Form>

                <label htmlFor="age">Age</label>
                <Field name="age" as="select">
                    <option value=""/>
                    {Array.apply(18, Array(130)).map(function (x, i) {
                        return <option key={i} value={i}>{i}</option>;
                    })}
                </Field>
                <ErrorMessage name="age"/>

                <label htmlFor="gender">Gender</label>
                <Field name="gender" as="select">
                    <option key="" value=""/>
                    <option key="female" value="female">Female</option>
                    <option key="male" value="male">Male</option>
                    <option key="other" value="other">Other</option>
                </Field>
                <ErrorMessage name="gender"/>

                <label htmlFor="has_symptoms">Do you currently have or have you had symptoms?</label>
                <Field name="has_symptoms" as="select">
                    {select_options.map((item, i) => (
                        <option key={item.id} value={item.id}>{item.value}</option>
                    ))}
                </Field>
                <ErrorMessage name="has_symptoms"/>

                <label htmlFor="diagnosis.covid19_diagnosed">Have you been diagnosed with COVID-19?</label>
                <Field name="diagnosis.covid19_diagnosed" as="select">
                    {select_options.map((item, i) => (
                        <option key={item.id} value={item.id}>{item.value}</option>
                    ))}
                </Field>
                <ErrorMessage name="diagnosis.covid19_diagnosed"/>

                <label htmlFor="diagnosis.covid19_diagnosis_date">When were you diagnosed?</label>
                <DatePickerField name="diagnosis.covid19_diagnosis_date" maxDate={new Date()}/>
                <ErrorMessage name="diagnosis.covid19_diagnosis_date"/>

                <label htmlFor="diagnosis.first_symptoms_date">When did you first get symptoms?</label>
                <DatePickerField name="diagnosis.first_symptoms_date" maxDate={new Date()}/>
                <ErrorMessage name="diagnosis.first_symptoms_date"/>

                <label htmlFor="diagnosis.end_date">If you've recovered, when did you recover?</label>
                <DatePickerField name="diagnosis.end_date" maxDate={new Date()}/>
                <ErrorMessage name="diagnosis.end_date"/>

                {symptoms.map((symptom, i) => (
                    <div key={`symptoms.${symptom.id}`}>
                        <label htmlFor={`symptoms.${symptom.id}`}>{symptom.name}</label>
                        <Field name={`symptoms.${symptom.id}`} as="select">
                            {select_options.map((item, i) => (
                                <option key={item.id} value={item.id}>{item.value}</option>
                            ))}
                        </Field>
                        <ErrorMessage name={`symptoms.${symptom.id}`}/>
                    </div>
                ))}

                <label htmlFor="pregnancy.currently_pregnant">Are you currently pregnant?</label>
                <Field name="pregnancy.currently_pregnant" as="select">
                    {select_options.map((item, i) => (
                        <option key={item.id} value={item.id}>{item.value}</option>
                    ))}
                </Field>
                <ErrorMessage name="pregnancy.currently_pregnant"/>

                <label htmlFor="pregnancy.pregnancy_trimester">In what stage is your pregnancy?</label>
                <Field name="pregnancy.pregnancy_trimester" as="select">
                    <option key="" value=""/>
                    <option key="first_trimester" value="first_trimester">0-12 weeks</option>
                    <option key="second_trimester" value="second_trimester">13-26 weeks</option>
                    <option key="third_trimester" value="third_trimester">27 or more weeks</option>
                </Field>
                <ErrorMessage name="pregnancy.pregnancy_trimester"/>

                <label htmlFor="pregnancy.post_partum">Have you given birth in the last 6 weeks?</label>
                <Field name="pregnancy.post_partum" as="select">
                    <option key="" value=""/>
                    <option key="1" value="1">Yes</option>
                    <option key="0" value="0">No</option>
                </Field>
                <ErrorMessage name="pregnancy.post_partum"/>

                <label htmlFor="has_preexisting_conditions">Do you have any pre-existing medical conditions?</label>
                <Field name="has_preexisting_conditions" as="select">
                    {select_options.map((item, i) => (
                        <option key={item.id} value={item.id}>{item.value}</option>
                    ))}
                </Field>
                <ErrorMessage name="has_preexisting_conditions"/>

                {preexisting_conditions.map((condition, i) => (
                    <div key={`preexisting_conditions.${condition.id}`}>
                        <label htmlFor={`preexisting_conditions.${condition.id}`}>{condition.name}</label>
                        <Field name={`preexisting_conditions.${condition.id}`} as="select">
                            {select_options.map((item, i) => (
                                <option key={item.id} value={item.id}>{item.value}</option>
                            ))}
                        </Field>
                        <ErrorMessage name={`preexisting_conditions.${condition.id}`}/>
                    </div>
                ))}
                <button type="submit">Submit</button>
            </Form>
        </Formik>
    );
};

class Symptoms extends React.Component<WizardRouteComponentProps, {}> {

    constructor(props: WizardRouteComponentProps) {
        super(props);
    }

    handleComplete(values: FormValues) {
        this.props.location.state.user_data = values;
        axios.post('/api/save', this.props.location.state)
            .then((res) => {
                this.props.history.push({
                    pathname: '/wizard/completed',
                    state: this.props.location.state
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        if (this.props.location.state !== undefined) {
            return (
                <div>
                    <p>Indicate which symptoms you have</p>
                    <SymptomsForm
                        initialData={this.props.location.state.user_data}
                        onComplete={(e) => this.handleComplete(e)}/>
                </div>
            )
        } else {
            return (
                <Redirect to="/wizard"/>
            )
        }
    }
}

export default Symptoms;