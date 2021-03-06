import React from 'react'
import axios from 'axios'
import { Progress } from 'reactstrap'
import { Location, WizardStepProps } from '../types'
import { BrowserView, MobileView } from 'react-device-detect'
import { Button, Form } from 'react-bootstrap'

type UploadState = {
  selectedFile: File | null
  loaded: number
  processing: boolean
}

class Upload extends React.Component<WizardStepProps, UploadState> {
  state: UploadState = {
    selectedFile: null,
    loaded: 0,
    processing: false,
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectorFiles = e.target.files
    const selectedFile = selectorFiles ? selectorFiles[0] : null
    this.setState({
      selectedFile,
      loaded: 0,
      processing: false,
    })
    this.processZip(selectedFile)
  }

  onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    this.processZip(this.state.selectedFile)
  }

  processZip(selectedFile: File | null) {
    const data = new FormData()
    if (!selectedFile) {
      return console.warn('selected file was null')
    }
    data.append('file', selectedFile)
    axios
      .post('/api/extract/google-takeout', data, {
        onUploadProgress: (ProgressEvent) => {
          this.setState({
            loaded: Math.min((ProgressEvent.loaded / ProgressEvent.total) * 100, 95),
            processing: ProgressEvent.loaded === ProgressEvent.total,
          })
        },
      })
      .then((res) => {
        const locations: Location[] = []
        // @ts-ignore
        res.data.data.forEach(function (location) {
          const loc: Location = JSON.parse(JSON.stringify(location))
          loc.filtered = false
          locations.push(loc)
        })

        if (locations.length > 0) {
          const state = this.props.data
          state.locations = locations
          this.props.onNavigate(undefined, '/wizard/select-data', state)
        } else {
          this.props.onNavigate(undefined, '/wizard/completed', {
            locations: [],
            no_valid_data: true,
          })
        }
      })
  }

  render() {
    const { selectedFile } = this.state

    return (
      <>
        <MobileView>
          <section>
            You're accessing this website from a mobile device. This is currently not supported, please visit
            on a desktop/laptop.
          </section>
          <Button variant="primary" href="/">
            Back to home
          </Button>
        </MobileView>
        <BrowserView>
          <Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.onFormSubmit(e)}>
            <section>
              <Form.File custom={true}>
                <Form.File.Input isValid={false} onChange={this.handleChange.bind(this)} />
                <Form.File.Label data-browse="Upload">
                  {selectedFile ? selectedFile.name : 'Upload your Google zip file here'}
                </Form.File.Label>
                {/* <Form.Control.Feedback type="valid">You did it!</Form.Control.Feedback> */}
              </Form.File>
            </section>

            <section>
              <Progress max="100" color="success" value={this.state.loaded}>
                {Math.round(this.state.loaded)}%
              </Progress>
            </section>
          </Form>
          <h3>How do I obtain my location data?</h3>
          <div className="demonstrationContainer">
            <img className="instructionsGif" src="/google_takeout_instructions.gif" alt="Google Takeout instructions" />
            <div className="stepsContainer">
              <ul>
                <li>1. Go to <a href="https://takeout.google.com/" title="Google Takeout">takeout.google.com</a></li>
                <li>2. Login to your Google account</li>
                <li>3. Click "Deselect all"</li>
                <li>4. Select the checkbox next to "Location history"</li>
                <li>5. Click "Next step"</li>
                <li>6. Select e-mail as delivery method</li>
                <li>7. Wait a couple of minutes for an email with a download link</li>
                <li>8. Download your data by clicking the link in the e-mail</li>
                <li>9. Upload your data above</li>
              </ul>
            </div>
          </div>
          <div className="additionalInstructionsContainer">
            <p>After you've uploaded your data, you'll be able to filter and review your data before you submit it.</p>
          </div>
        </BrowserView>
      </>
    )
  }
}

export default Upload
