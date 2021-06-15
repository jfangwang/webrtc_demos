import './Auth.css';
import './Camera.css';
import { auth, provider } from './firebase';
import firebase from 'firebase';
import React, { Component, useEffect } from 'react';
import { db } from './firebase';
import {delete_guest, delete_posts } from './Camera.js';

let friends_list = [];
let to_users = [];
let me = null;

function User_item({name, email}) {
  var friend = false;
  to_users = [];
  const select = () => {
    var item = document.getElementById(email);
    if (!friends_list.includes(email)) {
      if (item.classList.contains("selected")) {
        item.classList.remove("selected");
        const index = to_users.indexOf(email);
        to_users.splice(index, 1);
      } else {
        item.classList.add("selected");
        to_users.push(email);
      }
    }
  }
  var displayName = firebase.auth().currentUser.displayName;
  var displayEmail = firebase.auth().currentUser.email;
  if (name == displayName && email == displayEmail) {
    me = true;
  } else {
    me = false;
  }
  if (friends_list.includes(email)) {
    friend = true;
  }
  return (
    <div>
      {me ? <div id={email} className="User_item selected" onClick={select}>Me</div> : null }
      {friend && !me? <div id={email} className="User_item selected" onClick={select}>{name} ({email})</div>: null}
      {!friend ? <div id={email} className="User_item" onClick={select}>{name} ({email})</div> : null}
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

    const save_friends = () => {
      var user_email = firebase.auth().currentUser.email;
      to_users.forEach((item) => {
        if(!friends_list.includes(item)) {
          friends_list.push(item);
        }
        var user_doc = db.collection('users').doc(user_email);
        user_doc.update({
          friends: friends_list
        }).then(() => {
          console.log("updated friends lists on firesotre");
        }).catch((error) => {
          console.error("error saving friends");
        })
      })
    }
    return (
      <>
      <div className="User_list">
        <h1> Friends </h1>
        {posts.map(({data: { name, email }}) => (
          <div>
          {friends_list.includes(email) ? <User_item name={name} email={email}/>: <User_item name={name} email={email}/>}
          </div>
        ))}
        <button onClick={save_friends}>add</button>
      </div>
      </>
    )
}


class Auth extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.open_modal = this.open_modal.bind(this);
        this.close_modal = this.close_modal.bind(this);
        this.update = this.update.bind(this);
        this.add_friends = this.add_friends.bind(this);
        this.state = {
          show_users: false,
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

    add_friends() {
      var show = this.state.show_users;
      this.setState({show_users: !show});
      var user_email = firebase.auth().currentUser.email;
      var photo_doc = db.collection('users').doc(user_email);
      photo_doc.get().then((snapshot) => {
        friends_list = snapshot.data()["friends"]
        const index = friends_list.indexOf(user_email);
      })
    }

    handleLogin() {
        delete_guest();
        delete_posts();
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
              photoURL: result.user.photoURL,
              friends: [email]
            })
            .then(() => {
              this.setState({loggedIn: true});
              console.log("Document successfully written!");
            })
            .catch((error) => {
                console.log("Error writing document: ", error);
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
        window.location.reload();
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
        let account, modal, friends;

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
            modal = <button onClick={this.add_friends}>add friends</button>
        }
        if (this.state.show_users) {
          friends = <div className="modal"><User_list close={false}/></div>
        } else {
          friends = null
        }
        return (
            <div className="navbar">
                {account}
                {modal}
                {friends}
            </div>
        );
    }
}

export default Auth;