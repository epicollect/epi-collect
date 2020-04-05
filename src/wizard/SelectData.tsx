import React from 'react'
import { GeoMapState, Location, WizardStepProps } from '../types'
import GeoMap from './GeoMap'
import { Redirect } from 'react-router-dom'
import './SelectData.scss'

type DataSelectorState = {}

class SelectData extends React.Component<WizardStepProps, DataSelectorState> {
  onDone = (locations: Location[], geomap_state: GeoMapState) => {
    const state = this.props.data
    state.locations = locations
    state.geomap = geomap_state
    this.props.onNavigate(undefined, '/wizard/symptoms', state)
  }

  render() {
    if (this.props.data.locations.length !== 0) {
      return (
        <div>
          <GeoMap
            locations={this.props.data.locations}
            onDone={this.onDone}
            values={this.props.data.geomap && this.props.data.geomap.values}
            overlays={this.props.data.geomap && this.props.data.geomap.overlays}
            selected_time_range={
              this.props.data.geomap && this.props.data.geomap.selected_time_range
            }
          />
        </div>
      )
    } else {
      return <Redirect to="/wizard" />
    }
  }
}

export default SelectData
