import './Auth.css';
import { auth, provider } from './firebase';
import firebase from 'firebase';
import React, { Component } from 'react';

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
    return <h1>Please sign up.</h1>;
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
        this.state = {loggedIn: false, user:null};
    }

    handleLogin() {
        this.setState({loggedIn: true});
        auth.signInWithPopup(provider)
        .then((result) => {
            const name = result.user.displayName;
            const email = result.user.email;
            const photoURL = result.user.photoURL;
            var img = document.getElementById("profile-pic");
            img.setAttribute('src', photoURL);
            console.log(name, email, photoURL);
        })
        .catch((error) => alert(error.message));

    }
    handleLogout() {
        this.setState({loggedIn: false});
        firebase.auth().signOut().then(() => {
            console.log("signed out");
            var img = document.getElementById("profile-pic");
            img.removeAttribute('src');
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
                <button onClick={this.getUser}>Get User</button>
                <img id="profile-pic"></img>
            </div>
        );
    }
}

export default Auth;