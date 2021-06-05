import './Auth.css';
import { auth, provider } from './firebase';
import firebase from 'firebase';
import React, { Component } from 'react';
import { db } from './firebase';

function LoginButton(props) {
    return (
      <button onClick={props.onClick}>
        Login
      </button>
    );
  }

  function LogoutButton(props) {
    return (
      <button onClick={props.onClick}>
        Logout
      </button>
    );
  }

  function UserGreeting(props) {
    return <h1>Welcome back</h1>;
  }

  function GuestGreeting(props) {
    return <h1></h1>;
  }

  function Greeting(props) {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
      return <UserGreeting />;
    }
    return <GuestGreeting />;
  }

class Auth extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {loggedIn: false, user:null, photoURL:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png'};
    }

    componentDidMount() {
      var img = document.getElementById("profile-pic");
      // var user = firebase.auth().currentUser;
      // if (user) {
      //   this.setState({ loggedIn: true });
      // }
      firebase.auth().onAuthStateChanged(function(user) {
        if (user != null) {
          var photoURL = user.photoURL;
        }
        img.setAttribute('src', photoURL);
      });
    }

    handleLogin() {
        this.setState({loggedIn: true});
        auth.signInWithPopup(provider)
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
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });

        })
        .catch((error) => alert(error.message));

    }
    handleLogout() {
        firebase.auth().signOut().then(() => {
          this.setState({loggedIn: false});
          this.setState({photoURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png'});
          var img = document.getElementById("profile-pic");
          img.setAttribute('src', this.state.photoURL);
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
        let button;

        if (loggedIn) {
            button = <LogoutButton onClick={this.handleLogout} />
        } else {
            button = <LoginButton onClick={this.handleLogin} />
        }
        return (
            <div>
                <Greeting loggedIn={loggedIn} />
                {button}
                {/* <button onClick={this.getUser}>Get User</button> */}
                <img id="profile-pic"/>
            </div>
        );
    }
}

export default Auth;