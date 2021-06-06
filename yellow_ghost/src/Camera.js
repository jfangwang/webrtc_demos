import React, { Component, useEffect } from 'react';
import Webcam from "react-webcam";
import { v4 as uuid } from "uuid";
import './Camera.css';
import { storage, db } from './firebase';
import firebase from 'firebase';

let to_users = [];
var me = false;
function User_item({name, email}) {
  to_users = [];
  const select = () => {
    var item = document.getElementById(email);
    if (item.classList.contains("selected")) {
      item.classList.remove("selected");
      const index = to_users.indexOf(name);
      to_users.splice(index, 1);
    } else {
      item.classList.add("selected");
      to_users.push(name);
    }

  }
  var displayName = firebase.auth().currentUser.displayName;
  if (name == displayName) {
    me = true;
  } else {
    me = false;
  }
  return (
    <div>
      {me ? <div id={email} className="User_item" onClick={select}>{name} (me)</div> :
            <div id={email} className="User_item" onClick={select}>{name}</div> }
    </div>

  )
}

function User_list() {
  const [posts, setPosts] = React.useState([]);

    useEffect(() => {
        db.collection('users')
        .orderBy('name', 'desc')
        .onSnapshot((snapshot) =>
            setPosts(
                snapshot.docs.map((doc) => ({
                    data: doc.data(),
                }))
            )
        );
    }, [])

    return (
        <div className="User_list">
            <h1> Send to...</h1>
            {posts.map(({data: { name, email }}) => (
                <User_item
                    name={name}
                    email={email}
                />
            ))}
        </div>
    )
}
class Camera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            image: null,
            show_user_list: false,
            show_send_button: false,
            show_send_to: false
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
        var email = "GUEST"
        var name = "GUEST";
        var photoURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png";
        if (user){
          email = user.email;
          name = user.displayName;
          photoURL = user.photoURL;
        } else {
          email = "GUEST"
          name = "GUEST";
          photoURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png";
        }
        if (this.state.image != null) {
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
                  email: email,
                  name: name,
                  photoURL: photoURL,
                  read: false,
                  timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                  to: to_users,
                })
              })
          })
          this.setState({ image: null});
          this.setState({show_user_list: false});
          this.setState({show_send_button: false, show_send_to: false});
        } else {
          console.log("Cannot send image");
        }

    }

    close = () => {
        this.setState({ image: null })
        this.setState({show_user_list: false});
        this.setState({show_send_button: false, show_send_to: false});
    }

    send_to = () => {
      this.setState({show_user_list: true});
      this.setState({ show_send_button: true, show_send_to: false});
    }

    capture = () => {
        const img = this.webcam.getScreenshot();
        this.setState({ image: img, show_send_to: true });
    }

    setRef = (webcam) => {
        this.webcam = webcam;
      };

    render() {
        return (
            <div className="body">
                { this.state.image ? <img src={this.state.image} alt="asdf"/> : <Webcam
                    ref={this.setRef}
                    videoConstraints={{facingMode: this.state.faceMode, width: this.state.width, height: this.state.height}}
                    screenshotFormat="image/jpeg"
                    audio={false}
                    mirrored={true}
                />}

                { this.state.show_user_list ? <User_list/> : null}
                { this.state.image ? <button className="close" onClick={this.close}>Close</button> : <button className="capture" onClick={this.capture}>Capture</button> }
                { this.state.show_send_to ? <button className="send_to" onClick={this.send_to}>Send to...</button> : null}
                { this.state.show_send_button ? <button className="send" onClick={this.send}>Send</button> : null}
            </div>
        );
    }
}

export default Camera;