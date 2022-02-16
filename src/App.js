import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import Storage from "@aws-amplify/storage";

Amplify.configure(aws_exports);

class App extends Component {
  state = {
    imageName: "",
    imageFile: "",
    response: ""
  };
  uploadImage = () => {

     Storage.configure({ 
          bucket: "ac-upload-storage-ab141843-devm",
          level: "private",
          region: "ap-southeast-1",  
          identityPoolId: "ap-southeast-1:f9cac8e9-9c0c-46c2-8893-a2fa87a90591" 
       });

    this.setState({response:  "uploading file..."});
    Storage.put(`videos/${this.upload.files[0].name}`,
                this.upload.files[0],
                { contentType: this.upload.files[0].type })
      .then(result => {
        this.upload = null;
        this.setState({ response: "Successfully uploaded the file!" });
      })
      .catch(err => {
        this.setState({ response: `Cannot uploading file: ${err}` });
      });
  };

  render() {
    return (
      <div className="App">
	<AmplifySignOut />
        <h2>S3 Upload...</h2>
        <input
          type="file"
          accept="video/mp4, video/quicktime"
          style={{ display: "none" }}
          ref={ref => (this.upload = ref)}
          onChange={e =>
            this.setState({
              imageFile: this.upload.files[0],
              imageName: this.upload.files[0].name
            })
          }
        />
        <input value={this.state.imageName} placeholder="Select file" />
	<button
          onClick={e => {
            this.upload.value = null;
            this.upload.click();
          }}
          loading={this.state.uploading}
        >
          Browse
        </button>

        <button onClick={this.uploadImage}> Upload File </button>

        {!!this.state.response && <div>{this.state.response}</div>}
      </div>
    );
  }
}


export default withAuthenticator(App);
