import React from 'react'
import { GeoMapProps, GeoMapState, Location } from '../../types'
import { DrawingManager, GoogleMap, useLoadScript } from '@react-google-maps/api'
import { Spinner, Button, Row, Col, ButtonToolbar, ButtonGroup } from 'react-bootstrap'
import { Handles, Rail, Slider, Tracks } from 'react-compound-slider'
import { Handle, SliderRail, Track } from '../SliderComponents'
import { Container } from 'reactstrap'
import { FaRegHandPaper, FaDrawPolygon } from 'react-icons/fa'
import './styles.scss'

const libraries = ['drawing', 'geometry']

// Hack to make the hook work inside a class component
const withIsLoadedHook = (Component: any) => {
  return (props: any) => {
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: 'AIzaSyBN43nCvCjoX8TTGKhIq0hBj1pYEA0DZwE',
      libraries,
    })
    if (loadError) {
      return <div>Map cannot be loaded right now, sorry.</div>
    }

    return isLoaded ? <Component {...props} /> : <div className="text-center"><Spinner animation="border" variant="success" /></div>
  }
}

const MS_IN_A_DAY = 24 * 60 * 60 * 1000

// TODO: Can probably clean it up a bit and make it more React-style, get better typing.
class GeoMap extends React.Component<GeoMapProps, GeoMapState> {
  _map_instance = undefined

  constructor(props: GeoMapProps) {
    super(props)

    // Calculate the domain and values for the slider
    const min_timestamp = props.locations.reduce((min, p) =>
      p.timestamp < min.timestamp ? p : min
    ).timestamp
    const max_timestamp = props.locations.reduce((max, p) =>
      p.timestamp > max.timestamp ? p : max
    ).timestamp
    // The unit for domain and values will be days from the day *before* min_timestamp, up until the day *after* max_timestamp
    const min_days_since_epoch = Math.floor(new Date(min_timestamp).getTime() / MS_IN_A_DAY)
    const max_days_since_epoch = Math.ceil(new Date(max_timestamp).getTime() / MS_IN_A_DAY)

    this.state = {
      overlays: props.overlays !== undefined ? props.overlays : [],
      markers: [],
      valid_markers: [],
      selected_overlay: undefined,
      domain: [min_days_since_epoch, max_days_since_epoch],
      domain_timestamp: [min_timestamp, max_timestamp],
      values:
        props.values !== undefined ? props.values : [min_days_since_epoch, max_days_since_epoch],
      selected_time_range:
        props.selected_time_range !== undefined
          ? props.selected_time_range
          : [
              new Date(Math.round(min_days_since_epoch * MS_IN_A_DAY)).getTime(),
              new Date(Math.round(max_days_since_epoch * MS_IN_A_DAY)).getTime(),
            ],
    }
  }

  componentWillUnmount(): void {
    if (this._map_instance !== undefined) {
      // @ts-ignore
      google.maps.event.clearInstanceListeners(this._map_instance)
    }
  }

  formatTimestamp = (timestamp: number) => {
    const dateString = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour12: false,
    }).format(new Date(timestamp))

    const timeString = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(new Date(timestamp))

    return {
      dateString,
      timeString,
      fullString: dateString + ', ' + timeString,
    }
  }

  handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    this.props.onDone(this.getValidLocations(), this.state)
  }

  onSliderUpdate = (values: ReadonlyArray<number>) => {
    // This gets called very often, so only update the state
    const min_value = values.reduce((min, p) => (p < min ? p : min))
    const max_value = values.reduce((max, p) => (p > max ? p : max))
    const selected_time_range: number[] = [
      new Date(Math.round(min_value * MS_IN_A_DAY)).getTime(),
      new Date(Math.round(max_value * MS_IN_A_DAY)).getTime(),
    ]
    this.setState({
      selected_time_range,
      values: values.slice(),
    })
    return selected_time_range
  }

  onSliderChange = (values: ReadonlyArray<number>) => {
    // Update the state and show/hide markers based on time range
    this.setValidMarkers(this.state.markers, this.state.overlays, this.onSliderUpdate(values))
  }

  setValidMarkers = (markers: any[], overlays: any[], selected_time_range: number[]) => {
    const valid_markers: any[] = []
    const all_markers: any[] = []
    markers.forEach((marker: any) => {
      // Check if marker is inside any polygon
      let outside_all_overlays: boolean = true
      overlays.forEach((overlay: any) => {
        // @ts-ignore
        if (google.maps.geometry.poly.containsLocation(marker.getPosition(), overlay.overlay)) {
          outside_all_overlays = false
        }
      })
      const inside_time_range =
        marker.timestamp > selected_time_range[0] && marker.timestamp < selected_time_range[1]
      if (outside_all_overlays && inside_time_range) {
        valid_markers.push(marker)
        marker.setIcon({
          anchor: {
            x: 16,
            y: 16,
          },
          size: {
            height: 32,
            width: 32,
          },
          url: 'https://maps.google.com/mapfiles/kml/shapes/placemark_circle.png',
        })
      } else {
        marker.setIcon({
          anchor: {
            x: 16,
            y: 16,
          },
          size: {
            height: 32,
            width: 32,
          },
          url: 'https://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png',
        })
      }
      all_markers.push(marker)
    })
    this.setState({
      valid_markers,
      markers: all_markers,
    })
  }

  getValidLocations = () => {
    this.props.locations.forEach((location: Location, index) => {
      const marker_idx = this.state.valid_markers.findIndex(
        (element: any) => element.location_idx === index
      )
      if (marker_idx < 0) {
        location.filtered = true
      }
    })
    return this.props.locations
  }

  clearSelection = () => {
    if (this.state.selected_overlay) {
      this.state.selected_overlay.setEditable(false)
      this.setState({
        selected_overlay: undefined,
      })
    }
  }

  setSelection = (shape: any) => {
    this.clearSelection()
    this.setState({
      selected_overlay: shape,
    })
    shape.setEditable(true)
  }

  deleteSelectedShape = () => {
    const idx = this.state.overlays.indexOf(this.state.selected_overlay)
    if (this.state.selected_overlay) {
      this.state.selected_overlay.setMap(null)
    }
    const overlays = this.state.overlays.slice()
    overlays.splice(idx, 1)
    this.setState({
      overlays,
      selected_overlay: undefined,
    })
    this.setValidMarkers(this.state.markers, overlays, this.state.selected_time_range)
  }

  deleteAllShapes = () => {
    for (let i = 0; i < this.state.overlays.length; i++) {
      // @ts-ignore
      this.state.overlays[i].overlay.setMap(null)
    }
    this.setState({
      overlays: [],
    })
    this.setValidMarkers(this.state.markers, [], this.state.selected_time_range)
  }

  // @ts-ignore
  onMapLoad = (map_instance: google.maps.Map<Element>) => {
    // @ts-ignore
    google.maps.event.addListener(map_instance, 'click', this.clearSelection)
    this._map_instance = map_instance

    // Center the view
    // @ts-ignore
    const bounds = new google.maps.LatLngBounds()
    this.props.locations.forEach((loc) => {
      bounds.extend({
        lat: loc.latitude,
        lng: loc.longitude,
      })
    })
    map_instance.fitBounds(bounds)

    // Add overlays
    this.state.overlays.forEach((overlay) => {
      console.log(overlay)
      overlay.overlay.setMap(map_instance)
    })

    // Add markers
    const markers: any[] = []
    // @ts-ignore
    const infowindow = new google.maps.InfoWindow({
      content: '',
    })
    this.props.locations.forEach((location: Location, index: number) => {
      const formattedTimestamp: string = this.formatTimestamp(location.timestamp).fullString
      // @ts-ignore
      const marker = new google.maps.Marker({
        position: {
          lat: location.latitude,
          lng: location.longitude,
        },
        title: formattedTimestamp,
      })
      // @ts-ignore
      marker.addListener('click', function () {
        infowindow.setContent(formattedTimestamp)
        infowindow.open(map_instance, marker)
      })
      marker.setMap(map_instance)
      marker.location_idx = index
      marker.timestamp = location.timestamp
      markers.push(marker)
    })
    this.setState({
      markers,
    })
    this.setValidMarkers(markers, this.state.overlays, this.state.selected_time_range)
  }

  // @ts-ignore
  onOverlayComplete = (e: google.maps.drawing.OverlayCompleteEvent) => {
    // @ts-ignore
    const new_overlays = this.state.overlays.slice()
    // @ts-ignore
    new_overlays.push(e)
    this.setState({
      overlays: new_overlays,
    })

    // @ts-ignore
    if (e.type !== google.maps.drawing.OverlayType.MARKER) {
      const new_overlay = e.overlay
      new_overlay.type = e.type
      // @ts-ignore
      google.maps.event.addListener(new_overlay, 'click', () => {
        this.setSelection(new_overlay)
      })
      this.setSelection(new_overlay)
      this.setValidMarkers(this.state.markers, new_overlays, this.state.selected_time_range)
    }
  }

  render() {
    const { selected_time_range } = this.state
    const formattedFromString = this.formatTimestamp(selected_time_range[0])
    const formattedToString = this.formatTimestamp(selected_time_range[1])
    return (
      <>
        <section className="text-center">
          Select which of these {this.state.valid_markers.length} locations you want to submit
        </section>
        <section className="sliderSection">
          <Slider
            mode={2}
            step={0.01}
            domain={this.state.domain}
            rootStyle={{
              position: 'relative' as 'relative',
              width: '100%',
            }}
            onChange={this.onSliderChange}
            onUpdate={this.onSliderUpdate}
            values={this.state.values}
          >
            <Rail>{({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}</Rail>
            <Handles>
              {({ handles, getHandleProps }) => (
                <div className="slider-handles">
                  {handles.map((handle) => (
                    <Handle
                      key={handle.id}
                      handle={handle}
                      domain={this.state.domain}
                      getHandleProps={getHandleProps}
                    />
                  ))}
                </div>
              )}
            </Handles>
            <Tracks left={false} right={false}>
              {({ tracks, getTrackProps }) => (
                <div className="slider-tracks">
                  {tracks.map(({ id, source, target }) => (
                    <Track key={id} source={source} target={target} getTrackProps={getTrackProps} />
                  ))}
                </div>
              )}
            </Tracks>
          </Slider>
        </section>
        <section>
          <Container>
            <Row>
              <Col className="formattedDateString">
                <div>From:</div>
                {formattedFromString.dateString}
                <br />
                {formattedFromString.timeString}
              </Col>
              <Col className="formattedDateString">
                <div>To:</div>
                {formattedToString.dateString}
                <br />
                {formattedToString.timeString}
              </Col>
            </Row>
          </Container>
        </section>
        {/* <section>
          <ButtonToolbar>
            <ButtonGroup>
              <Button variant="light">
                <FaRegHandPaper />
                Move
              </Button>
              <Button variant="light">
                <FaDrawPolygon />
                Draw
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
          <button onClick={this.deleteSelectedShape}>Delete selected shape</button>
          <button onClick={this.deleteAllShapes}>Delete all shapes</button>
        </section> */}
        <section>
          <GoogleMap
            mapContainerStyle={{
              height: '500px',
              width: '100%',
            }}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
            }}
            onLoad={this.onMapLoad}
          >
            <DrawingManager
              options={{
                // drawingMode: null,
                drawingControlOptions: {
                  drawingModes: [''],
                },
                markerOptions: {
                  draggable: true,
                },
                // polylineOptions: {
                //   editable: true,
                // },
                // rectangleOptions: {
                //   strokeWeight: 0,
                //   fillOpacity: 0.45,
                //   editable: true,
                // },
                circleOptions: {
                  strokeWeight: 0,
                  fillOpacity: 0.45,
                  editable: true,
                },
                // polygonOptions: {
                //   strokeWeight: 0,
                //   fillOpacity: 0.45,
                //   editable: true,
                // },
              }}
              onOverlayComplete={this.onOverlayComplete}
            />
          </GoogleMap>
        </section>
        <section className="text-right">
          <Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => this.handleClick(e)}>
            Next
          </Button>
        </section>
      </>
    )
  }
}

export default withIsLoadedHook(GeoMap)
