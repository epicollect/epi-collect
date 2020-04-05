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
  constructor(props: WizardStepProps) {
    super(props)
    this.state = {
      selectedFile: null,
      loaded: 0,
      processing: false,
    }
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectorFiles = e.target.files
    this.setState({
      selectedFile: selectorFiles ? selectorFiles[0] : null,
      loaded: 0,
      processing: false,
    })
  }

  onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData()
    const selected_file = this.state.selectedFile as File
    data.append('file', selected_file)
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
            You're accessing this website from a mobile device. This is not supported, please visit
            on a desktop/laptop. (text TODO)
          </section>
          <Button variant="primary" href="/">
            Back to home
          </Button>
        </MobileView>
        <BrowserView>
          <Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.onFormSubmit(e)}>
            <section>
              <Form.File custom={true}>
                <Form.File.Input
                  isValid={false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.handleChange.bind(this)
                  }
                />
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

            <section>
              <Button type="submit">Upload</Button>
            </section>
          </Form>
        </BrowserView>
      </>
    )
  }
}

export default Upload
