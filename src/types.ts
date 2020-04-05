import React from 'react'

export type Activity = {
  timestamp: number
  activity: string
  confidence: number
}

export type Location = {
  timestamp: number
  longitude: number
  latitude: number
  accuracy: number
  filtered: boolean
  activities: Activity[]
}

export type FormValues = {
  [key: string]: FormValues | string
}

export type GeoMapProps = {
  locations: Location[]
  onDone: (locations: Location[], state: GeoMapState) => void
  overlays: any[]
  values: number[]
  selected_time_range: number[]
}

export type GeoMapState = {
  overlays: any[]
  selected_overlay: any
  markers: any[]
  valid_markers: any[]
  domain: number[]
  domain_timestamp: ReadonlyArray<number>
  values: number[]
  selected_time_range: number[]
}

export type WizardState = {
  locations: Location[]
  user_data?: FormValues
  geomap?: GeoMapState
  token?: string
  no_valid_data?: boolean
}

export type WizardStepProps = {
  onNavigate: (
    event: React.SyntheticEvent<any> | undefined,
    uri: string,
    state: WizardState
  ) => void
  data: WizardState
}
