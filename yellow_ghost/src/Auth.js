import './Auth.css';
import { auth, provider } from './firebase';
import firebase from 'firebase';
import React, { Component } from 'react';
import { db } from './firebase';


class Auth extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.open_modal = this.open_modal.bind(this);
        this.close_modal = this.close_modal.bind(this);
        this.update = this.update.bind(this);
        this.state = {
          loggedIn: false,
          user:null,
          modal_open: false,
          photoURL:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png'};
    }

    componentDidMount() {
      window.addEventListener('afterunload', () =>{
        this.update();
      });
      this.update();
    }

    update = () => {
      var img = document.getElementById("profile-pic");
      firebase.auth().onAuthStateChanged(function(user) {
        if (user != null) {
          var photoURL = user.photoURL;
          img.setAttribute('src', photoURL);
          this.setState({loggedIn: true});
        } else {
          this.setState({loggedIn: false});
          img.setAttribute('src', "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png");
        }
      }.bind(this))
    }

    open_modal() {
      this.setState({
        modal_open: true
      })
    }

    close_modal() {
      this.setState({
        modal_open: false
      })
      this.update();
    }

    handleLogin() {
        console.log("login");
        auth.signInWithRedirect(provider);
        auth.getRedirectResult()
        .then((result) => {
            const name = result.user.displayName;
            const email = result.user.email;
            this.setState({photoURL: result.user.photoURL});
            var img = document.getElementById("profile-pic");
            img.setAttribute('src', this.state.photoURL);
            // Adding user to user DB
            db.collection("users").doc(email).set({
              email: email,
              name: name,
              photoURL: result.user.photoURL
            })
            .then(() => {
              this.setState({loggedIn: true});
              console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });

        })
        .catch((error) => console.log(error.message));

    }
    handleLogout() {
        console.log("logout");
        firebase.auth().signOut().then(() => {
          this.setState({loggedIn: false});
          this.setState({photoURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png'});
          var img = document.getElementById("profile-pic");
          img.setAttribute('src', "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png");
        }).catch((error) => {
            console.log(error.message);
        });
    }
    getUser() {
        var user = firebase.auth().currentUser;

        if (user) {
        // User is signed in.
            console.log(user.displayName);
        } else {
        // No user is signed in.
            console.log("no user found")
        }
    }
    render() {
        const loggedIn = this.state.loggedIn;
        let account, modal;

        if (this.state.modal_open && this.state.loggedIn) {
            account = <img id="profile-pic" src="https://cdn1.iconfinder.com/data/icons/arrows-vol-1-4/24/dropdown_arrow-512.png" onClick={this.close_modal}/>
            modal = <div className="modal">
              <h2>Settings</h2>
              <h4 className="modal_item" onClick={this.handleLogout}>Logout</h4>
            </div>
        }
        else if (loggedIn == false) {
          account = <img id="profile-pic" onClick={this.handleLogin}/>
          modal = null
        }
        else {
            account = <img id="profile-pic" onClick={this.open_modal}/>
            modal = null
        }
        return (
            <div className="navbar">
                {account}
                {modal}
            </div>
        );
    }
}

export default Auth;