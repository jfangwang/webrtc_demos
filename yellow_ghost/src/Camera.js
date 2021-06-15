import React, { Component, useEffect } from 'react';
import Webcam from "react-webcam";
import { v4 as uuid } from "uuid";
import './Camera.css';
import { storage, db, guest_id } from './firebase';
import firebase from 'firebase';
import flipCamera from './images/flip_camera.svg';
import xButton from './images/x_button.png';
import { parseSync } from '@babel/core';

let to_users = [];
var me = false;
var front_cam = true;
var mobile = false;
export var guest = false;
const g_id = guest_id
export const guest_email = "GUEST." + g_id + "@project_yellow_ghost.com";
function User_item({name, email, photoURL}) {
  to_users = [];
  const select = () => {
    var item = document.getElementById(email);
    if (item.classList.contains("selected")) {
      item.classList.remove("selected");
      const index = to_users.indexOf(email);
      to_users.splice(index, 1);
    } else {
      item.classList.add("selected");
      to_users.push(email);
    }
  }
  let list;
  try{
    var displayName = firebase.auth().currentUser.displayName;
    var displayEmail = firebase.auth().currentUser.email;
    guest = false;
  } catch {
    guest = true;
  }

  if (name == displayName && email == displayEmail) {
    me = true;
  } else {
    me = false;
  }
  return (
    <div>
    { me && !guest ? <div id={email} className="User_item" onClick={select}><img className="profile_pic" src={photoURL}/><p className="user_text">Me</p></div> : null }
    { !me && !guest ? <div id={email} className="User_item" onClick={select}><img className="profile_pic" src={photoURL}/><p className="user_text">{name} ({email})</p></div>: null}
    { guest ? <div id={email} className="User_item" onClick={select}>Guest (me)</div>: null}
    </div>
  )
}
function User_list() {
  const [posts, setPosts] = React.useState([]);
  try {
    var displayName = firebase.auth().currentUser.displayName;
    var displayEmail = firebase.auth().currentUser.email;
    console.log(firebase.auth().currentUser);
  } catch {
    guest = true;
  }

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
    let list;
    if (guest == false) {
      list = <div>
      {posts.map(({data: { name, email, photoURL }}) => (
          <User_item
              name={name}
              email={email}
              photoURL={photoURL}
          />
      ))}
      </div>
    } else {
      list = <User_item name={guest_email} email={guest_email}/>
    }
    return (
      <div className="User_list">
      <h1 className="title" > Send to...</h1>
      {list}
      </div>
    )
}

export function delete_guest(){
  // Delete Guest Account
  var guest = db.collection('guests').doc(guest_email);
  guest.delete().then(() => {
    console.log("Guest Deleted");
  }).catch((error) => {
    console.error("Error removing guest: ", error);
  });
  // Delete Posts related to the guest account
  var guest = db.collection('guests').doc(guest_email);
}

export function delete_posts() {
  console.log("delete posts", guest_email);
  var posts = db.collection('posts');
  var guest_posts = posts.where("to", "array-contains", guest_email).get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      doc.ref.delete();
    });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });

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
            show_send_to: false,
            faceMode: "user",
            mirrored: false,
            mobile: false
        }
        window.addEventListener("resize", this.update);
    }
    componentDidMount() {
      console.log("MOUNTED");
      this.update();
      // window.onbeforeunload = function (evt) {
      //   // Cancel the event (if necessary)
      //   evt.preventDefault();

      //   // Google Chrome requires returnValue to be set
      //   evt.returnValue = '';
      //   delete_guest();
      //   delete_posts();
      //   return null;
      //  }

      // Mobile TESTING

    }
    update = () => {
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        // Mobile
        mobile = true;
        this.setState({
          mirrored: true,
          mobile: true
        });
      } else {
        // Desktop
        mobile = false;
        this.setState({
          mirrored: false,
          mobile: false
        });
      }
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    guest_login = () => {
      db.collection("guests").doc(guest_email).set({
        email: guest_email,
        name: "GUEST",
        friends: [guest_email],
      })
      .then(() => {
        console.log("Guest logged in");
      })
      .catch((error) => {
          console.log("Error writing document: ", error);
      });
    }

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
          email = guest_email;
          name = "Guest";
          photoURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png";
          this.guest_login()
        }
        if (this.state.image != null && to_users.length > 0) {
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
          alert("Please selected a user");
        }

    }

    close = () => {
        this.setState({ image: null })
        this.setState({show_user_list: false});
        this.setState({show_send_button: false, show_send_to: false});
    }

    send_to = () => {
      console.log("uuid", g_id)
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

    change_camera = () => {
      front_cam = !front_cam;
      if (mobile) {
        // Mobile
        if (front_cam) {
          this.setState({
            faceMode: "user",
            mirrored: true
          })
        } else {
          this.setState({
            faceMode: "environment",
            mirrored: false
          })
        }
      } else {
        // Desktop
        if (front_cam) {
          this.setState({
            faceMode: "user",
            mirrored: false
          })
        } else {
          this.setState({
            faceMode: "environment",
            mirrored: false
          })
        }
      }

    }

    render() {
      let webcam;

      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        // Mobile
        webcam = <Webcam
          ref={this.setRef}
          videoConstraints={{facingMode: this.state.faceMode, width: this.state.height, height: this.state.width}}
          screenshotFormat="image/jpeg"
          audio={false}
          mirrored={this.state.mirrored}
        />
      }else{
        webcam = <Webcam
          ref={this.setRef}
          videoConstraints={{facingMode: this.state.faceMode, width: this.state.width, height: this.state.height}}
          screenshotFormat="image/jpeg"
          audio={false}
          mirrored={this.state.mirrored}
        />
      }
        return (
            <div className="body">

                { this.state.image ? <img src={this.state.image} alt="asdf"/> : webcam}
                <div className="invisible_container">
                  { this.state.show_user_list ? <User_list/> : null}
                  <div className="top-tools">
                    { this.state.image ? <img src={xButton} className="close" onClick={this.close}></img> : null }
                    { this.state.image ? null : <img className="flip_camera" src={flipCamera} onClick={this.change_camera}></img>}
                  </div>
                  <div className="bottom-tools">
                    { this.state.image ? null : <button className="capture" onClick={this.capture} className="capture"></button>}
                    { this.state.show_send_to? <button className="send_to" onClick={this.send_to}>Send To</button> : null}
                    { this.state.show_send_button > 0 ? <button className="send" onClick={this.send}>Send</button> : null}
                  </div>
                </div>

            </div>

        );
    }
}

export default Camera;