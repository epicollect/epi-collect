import React, {useState} from 'react';
import {Location, WizardRouteComponentProps} from '../types';
import {Redirect} from 'react-router-dom';
import {DrawingManager, GoogleMap, useLoadScript} from '@react-google-maps/api';
import {Spinner} from 'react-bootstrap';

type GeoMapProps = {
    locations: Location[]
}

const libraries = ['drawing'];

// TODO: Below is mostly plain JS, can probably clean it up a bit and make it more React-style, get rid of ts-ignore.
const GeoMap = (props: GeoMapProps) => {
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: "AIzaSyBN43nCvCjoX8TTGKhIq0hBj1pYEA0DZwE",
        libraries: libraries
    });

    const [overlays, setOverlays] = useState([]);
    // @ts-ignore
    const [selected_overlay, setSelectedOverlay] = useState(undefined);

    const clearSelection = React.useCallback(() => {
        // @ts-ignore
        if (selected_overlay) {
            // @ts-ignore
            selected_overlay.setEditable(false);
            // @ts-ignore
            setSelectedOverlay(undefined);
        }
    }, [selected_overlay, setSelectedOverlay]);

    // @ts-ignore
    const setSelection = React.useCallback((shape) => {
        clearSelection();
        // @ts-ignore
        setSelectedOverlay(shape);
        shape.setEditable(true);
    }, [setSelectedOverlay, clearSelection]);

    const deleteSelectedShape = () => {
        // @ts-ignore
        if (selected_overlay) {
            // @ts-ignore
            selected_overlay.setMap(null);
        }
    };

    const deleteAllShapes = () => {
        for (let i = 0; i < overlays.length; i++) {
            // @ts-ignore
            overlays[i].overlay.setMap(null);
        }
        setOverlays([]);
    };

    const onMapLoad = React.useCallback(
        // @ts-ignore
        function onLoad(map_instance: google.maps.Map<Element>) {

            // @ts-ignore
            google.maps.event.addListener(map_instance, 'click', clearSelection);

            // Center the view
            // @ts-ignore
            let bounds = new google.maps.LatLngBounds();
            for (let i = 0; i < props.locations.length; ++i) {
                bounds.extend({
                    lat: props.locations[i].latitude,
                    lng: props.locations[i].longitude
                })
            }
            map_instance.fitBounds(bounds);

            // Add markers
            let markers = [];
            // @ts-ignore
            let infowindow = new google.maps.InfoWindow({
                content: ''
            });
            for (let i = 0; i < props.locations.length; ++i) {
                const formatted_timestamp: string = new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit',
                    weekday: 'short',
                    hour12: true
                }).format(new Date(props.locations[i].timestamp));
                // @ts-ignore
                const marker = new google.maps.Marker({
                    position: {
                        lat: props.locations[i].latitude,
                        lng: props.locations[i].longitude
                    },
                    title: formatted_timestamp,
                    icon: 'https://maps.google.com/mapfiles/kml/shapes/placemark_circle.png'
                });
                // @ts-ignore
                marker.addListener('click', function () {
                    infowindow.setContent(formatted_timestamp);
                    infowindow.open(map_instance, marker);
                });
                marker.setMap(map_instance);
                markers.push(marker);
            }
        }, [props, clearSelection]
    );

    const onOverlayComplete = React.useCallback(
        // @ts-ignore
        function onOverlayComplete(e: google.maps.drawing.OverlayCompleteEvent) {
            // @ts-ignore
            const new_overlays = overlays.slice();
            // @ts-ignore
            new_overlays.push(e);
            setOverlays(new_overlays);

            // @ts-ignore
            if (e.type !== google.maps.drawing.OverlayType.MARKER) {

                const new_overlay = e.overlay;
                new_overlay.type = e.type;
                // @ts-ignore
                google.maps.event.addListener(new_overlay, 'click', function () {
                    setSelection(new_overlay);
                });
                setSelection(new_overlay);
            }
        }, [overlays, setOverlays, setSelection]
    );

    const onDrawingManagerLoad = React.useCallback(
        // @ts-ignore
        function onLoad(drawing_manager: google.maps.drawing.DrawingManager) {
            // @ts-ignore
            google.maps.event.addListener(drawing_manager, 'drawingmode_changed', function () {
                clearSelection();
            });
        }, [clearSelection]
    );

    const renderMap = () => {

        return (
            <>
                <div>
                    <button onClick={deleteSelectedShape}>Delete selected shape</button>
                    <button onClick={deleteAllShapes}>Delete all shapes</button>
                </div>
                <GoogleMap
                    mapContainerStyle={{
                        height: "400px",
                        width: "100%"
                    }}
                    options={{
                        mapTypeControl: false,
                        streetViewControl: false
                    }}
                    onLoad={onMapLoad}
                >
                    <DrawingManager
                        options={{
                            drawingMode: 'polygon',
                            drawingControlOptions: {
                                drawingModes: ['polygon', 'rectangle']
                            },
                            markerOptions: {
                                draggable: true
                            },
                            polylineOptions: {
                                editable: true
                            },
                            rectangleOptions: {
                                strokeWeight: 0,
                                fillOpacity: 0.45,
                                editable: true
                            },
                            circleOptions: {
                                strokeWeight: 0,
                                fillOpacity: 0.45,
                                editable: true
                            },
                            polygonOptions: {
                                strokeWeight: 0,
                                fillOpacity: 0.45,
                                editable: true
                            },
                        }}
                        onOverlayComplete={onOverlayComplete}
                        onLoad={onDrawingManagerLoad}/>
                </GoogleMap>
            </>
        )
    };

    if (loadError) {
        return <div>Map cannot be loaded right now, sorry.</div>
    }

    return isLoaded ? renderMap() : <Spinner animation="border" variant="success"/>
};

type DataSelectorState = {};

class SelectData extends React.Component<WizardRouteComponentProps, DataSelectorState> {

    constructor(props: WizardRouteComponentProps) {
        super(props);
    }

    handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        this.props.history.push({
            pathname: '/wizard/symptoms',
            state: this.props.location.state
        })
    }


    render() {
        if (this.props.location.state !== undefined) {
            return (
                <div>
                    <p>Select on a map which of these {this.props.location.state.locations.length}
                        locations you want to submit</p>
                    <GeoMap locations={this.props.location.state.locations}/>
                    <a onClick={(e) => this.handleClick(e)}>Next</a>
                </div>
            )
        } else {
            return (
                <Redirect to="/wizard"/>
            )
        }
    }
}

export default SelectData;