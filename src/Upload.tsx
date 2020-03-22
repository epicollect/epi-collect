import React from 'react';
import axios from 'axios';
import {Progress} from 'reactstrap';
import './Upload.css';
import {Location, WizardRouteComponentProps} from "./types";

type UploadState = {
    selectedFile: File | null,
    loaded: number,
    processing: boolean
}

class Upload extends React.Component<WizardRouteComponentProps, UploadState> {

    constructor(props: WizardRouteComponentProps) {
        super(props);
        this.state = {
            selectedFile: null,
            loaded: 0,
            processing: false
        }
    }

    handleChange(selectorFiles: FileList | null) {
        this.setState({
            selectedFile: selectorFiles ? selectorFiles[0] : null,
            loaded: 0,
            processing: false
        })
    }

    onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData();
        const selected_file = this.state.selectedFile as File;
        data.append('file', selected_file);
        axios.post('/api/extract/google-takeout', data, {
            onUploadProgress: ProgressEvent => {
                this.setState({
                    loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
                    processing: ProgressEvent.loaded === ProgressEvent.total
                })
            },
        }).then((res) => {
            let locations: Location[] = [];
            // @ts-ignore
            res.data['data'].forEach(function (location) {
                const loc: Location = JSON.parse(JSON.stringify(location));
                locations.push(loc);
            });

            this.props.history.push({
                pathname: '/select-data',
                state: {
                    locations: locations
                }
            })
        });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <form onSubmit={(e) => this.onFormSubmit(e)}>
                        <input type="file" name="file" onChange={(e) => this.handleChange(e.target.files)}/>
                        <Progress max="100" color="success"
                                  value={this.state.loaded}>{Math.round(this.state.loaded)}%</Progress>
                        <button type="submit">Upload</button>
                    </form>
                </header>
            </div>
        )
    }
}

export default Upload;
