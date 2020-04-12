export type SelectField = {
  id: string
  name: string
}

export type SelectOption = {
  id: number | string
  value: string
}

// Questions and answers are based on WHO advice for countries reporting to WHO:
// https://www.who.int/publications-detail/global-surveillance-for-human-infection-with-novel-coronavirus-(2019-ncov)
// and https://www.worldometers.info/coronavirus/coronavirus-symptoms/#pre
export const preexisting_conditions: SelectField[] = [
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
];

export const symptoms: SelectField[] = [
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
];

export const pregnancy_trimester_options: SelectOption[] = [
  {id: 'first_trimester', value: '0-12 weeks'},
  {id: 'second_trimester', value: '13-26 weeks'},
  {id: 'third_trimester', value: '27 or more weeks'}
];

export const select_options: SelectOption[] = [
  { id: -1, value: '' },
  { id: 0, value: 'No' },
  { id: 1, value: 'Yes' },
];

export const SymptomQuestions = {
  age: "Age",
  gender: "Gender",
  has_symptoms: "Do you currently have or have you had symptoms?",
  diagnosis: {
    covid19_diagnosed: "Have you been diagnosed with COVID-19?",
    covid19_diagnosed_date: "If applicable, when were you diagnosed?",
    first_symptoms_date: "When did you first get symptoms?",
    end_date: "If you've recovered, when did you recover?"
  },
  pregnancy: {
    currently_pregnant: "Are you currently pregnant?",
    pregnancy_trimester: "In what stage is your pregnancy?",
    post_partum: "Have you given birth in the last 6 weeks?"
  },
  has_preexisting_conditions: "Do you have any pre-existing medical conditions?"
}