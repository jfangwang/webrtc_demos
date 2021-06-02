import React, { Component } from 'react';
import './Auth.css';
import { auth, provider } from './firebase';

function SignIn() {
    const login = () => {
        auth.signInWithPopup(provider)
        .then((result) => {
            const name = result.user.displayName;
            const email = result.user.email;
            const photoURL = result.user.photoURL;
            console.log(name, email, photoURL);
        })
        .catch((error) => alert(error.message));
    };
    return (
        <div>
            <button onClick={login} className="sign-in">Sign in</button>
        </div>
    );
};

class Auth extends Component {
    render() {
        return (
            <SignIn/>
        );
    }
}

export default Auth;