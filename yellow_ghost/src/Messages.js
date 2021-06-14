import React, { Component, useEffect } from 'react';
import { storage, db } from './firebase';
import ReactTimeago from 'react-timeago';
import './Messages.css';
import Auth from './Auth.js';
import firebase from 'firebase';

function Chat({id, name, email, timeStamp, imageURL, read, photoURL, to}) {
    const open = (id_num) => {
        const photo = storage.ref(`posts/${id_num}`).getDownloadURL()
        .then((url) => {
            var img = document.getElementById('photo');
            img.setAttribute('src', url);
            console.log("OPENING: ", id_num)
        })
        .catch((error) => {
            // Handle any errors
            console.log("COULD NOT GET PHOTO ", error)
        });
    }

    const delete_photo = () => {
      const photo = storage.ref(`posts/${id}`).delete()
      .then((url) => {
          console.log("Deleted from storage: ", id);
      })
      .catch((error) => {
          console.log("TRIED DELETING: ", id)
      });
      db.collection('posts').doc(id).delete().then(() => {
        console.log("Deleted from firestore");
      }).catch((error) => {
        console.error("Error removing document: ", error);
      });
    }

    const close = () => {
        delete_photo()
        var test = db.collection("posts").doc(id)
        console.log("test", test);

        var img = document.getElementById('photo');
        img.removeAttribute('src');
    }
    var user = firebase.auth().currentUser;
    var a = 0;
    if (user) {
        for (a=0;a<to.length;a++) {
            if (to[a] == user.email) {
                return (
                    <div className="Chat" onClick={(e) => open(id)}>
                        <img src={photoURL} className="photoURL"/>
                        <div className="chat-info">
                            <h4>{name}</h4>
                            {!read && <p className="status"><div className="red-block"/><p className="new-snap">New Snap</p><ReactTimeago date={new Date(timeStamp?.toDate()).toUTCString()}/></p>}
                            {read && <p>OPENED</p>}
                        </div>
                        <img id="photo" onClick={close}/>
                    </div>
                )
            }

        }
    }
    return (<div></div>)
}

function Chats() {
    const [posts, setPosts] = React.useState([]);

    useEffect(() => {
        db.collection('posts')
        .orderBy('timeStamp', 'desc')
        .onSnapshot((snapshot) =>
            setPosts(
                snapshot.docs.map((doc) => ({
                    data: doc.data(),
                }))
            )
        );
    }, [])

    return (
        <div className="Chats">
            {posts.map(({data: { id, name, email, timeStamp, imageURL, read, photoURL, to}}) => (
                <Chat
                    id={id}
                    name={name}
                    email={email}
                    timeStamp={timeStamp}
                    imageURL={imageURL}
                    read={read}
                    photoURL={photoURL}
                    to={to}
                />
            ))}
        </div>
    )
}

class Messages extends Component {
    render() {
        return (
            <div>
                <header>
                    <Auth/>
                    <h1>Chat</h1>
                </header>
                <div className="block"/>
                <Chats/>
            </div>

        );
    }
}

export default Messages;