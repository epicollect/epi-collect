import React from 'react';
import './App.css';

type AppState = {
    selectedFile: File | null,
    loaded: number
}

class App extends React.Component<{}, AppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            selectedFile: null,
            loaded: 0
        }
    }

    handleChange(selectorFiles: FileList | null) {
        this.setState({
            selectedFile: selectorFiles ? selectorFiles[0] : null,
            loaded: 0
        })
    }

    onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData();
        const selected_file = this.state.selectedFile as File;
        data.append('file', selected_file);
        fetch('/extract/google-takeout', {
            method: 'post',
            body: data
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data);
        });
    }

    render() {
      return (
          <div className="App">
            <header className="App-header">
              <form onSubmit={(e) => this.onFormSubmit(e)}>
                  <input type="file" name="file" onChange={(e) => this.handleChange(e.target.files)} />
                  <button type="submit">Upload</button>
              </form>
          </header>
        </div>
      )
    }
}

export default App;
