import React, { Component, useEffect } from 'react';
import { storage, db } from './firebase';
import ReactTimeago from 'react-timeago';
import './Messages.css';
import Auth from './Auth.js';

function Chat({id, email, timeStamp, imageURL, read, photoURL}) {
    const open = () => {
        const photo = storage.ref(`posts/${id}`).getDownloadURL()
        .then((url) => {
            var img = document.getElementById('photo');
            img.setAttribute('src', url);
            console.log("OPENING: ", id)
        })
        .catch((error) => {
            // Handle any errors
            console.log("COULD NOT GET PHOTO ", error)
        });
    }

    const close = () => {
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
        var img = document.getElementById('photo');
        img.removeAttribute('src');
    }

    return (
        <div>
            <div className="Chat" onClick={open}>
            <img src={photoURL} className="photoURL"/>
            <h4>{email}</h4>
            {!read && <p>NEW SNAP | <ReactTimeago date={new Date(timeStamp?.toDate()).toUTCString()}/></p>}
            {read && <p>OPENED</p>}
            <img id="photo" onClick={close}/>
            </div>
        </div>
    )
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
            <header className="navbar">
                <h1>Chat</h1>
                <Auth/>
            </header>
            {posts.map(({data: { id, email, timeStamp, imageURL, read, photoURL}}) => (
                <Chat
                    id={id}
                    email={email}
                    timeStamp={timeStamp}
                    imageURL={imageURL}
                    read={read}
                    photoURL={photoURL}
                />
            ))}
        </div>
    )
}

class Messages extends Component {
    render() {
        return (
            <body>
                <Chats/>
            </body>

        );
    }
}

export default Messages;