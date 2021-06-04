import React, { Component } from 'react';
import Webcam from "react-webcam";
import { v4 as uuid } from "uuid";
import './Camera.css';
import { storage, db } from './firebase';
import firebase from 'firebase';

class Camera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            image: null
        }
        window.addEventListener("resize", this.update);
    }

    update = () => {
        this.setState({
          width: window.innerWidth,
          height: window.innerHeight,
          faceMode: "user"
        });
    };

    send = () => {
        const id = uuid();
        var user = firebase.auth().currentUser;
        const uploadTask = storage.ref(`posts/${id}`).putString(this.state.image, 'data_url');
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {
            console.log(error);
          },
          () => {
            storage
              .ref("posts")
              .child(id)
              .getDownloadURL()
              .then(url => {
                console.log("Photo Sent");
                db.collection('posts').doc(id).set({
                  id: id,
                  imageURL: url,
                  email: user.email,
                  name: user.displayName,
                  photoURL: user.photoURL,
                  read: false,
                  timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
              })
          })
          this.setState({ image: null});
    }

    close = () => {
        this.setState({ image: null })
    }

    capture = () => {
        const img = this.webcam.getScreenshot();
        this.setState({ image: img })
        console.log(img);
    }

    setRef = (webcam) => {
        this.webcam = webcam;
      };

    render() {
        return (
            <div>
                <Webcam
                    ref={this.setRef}
                    videoConstraints={{facingMode: this.state.faceMode, width: this.state.width, height: this.state.height}}
                    screenshotFormat="image/jpeg"
                    audio={false}
                    mirrored={true}
                    className="webcam"
                />
                { this.state.image ? <img src={this.state.image} alt="asdf"/> : <Webcam
                    ref={this.setRef}
                    videoConstraints={{facingMode: this.state.faceMode, width: this.state.width, height: this.state.height}}
                    screenshotFormat="image/jpeg"
                    audio={false}
                    mirrored={true}
                />}
                { this.state.image ? <button className="close" onClick={this.close}>Close</button> : <button className="capture" onClick={this.capture}>Capture</button> }
                { this.state.image ? <button className="send" onClick={this.send}>Send</button> : null}
            </div>
        );
    }
}

export default Camera;