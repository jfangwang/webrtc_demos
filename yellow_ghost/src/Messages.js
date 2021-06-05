import React, { Component, useEffect } from 'react';
import { storage, db } from './firebase';
import ReactTimeago from 'react-timeago';
import './Messages.css';
import Auth from './Auth.js';

function Chat({id, name, timeStamp, imageURL, read, photoURL}) {
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
        <div className="Chat" onClick={open}>
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
            {posts.map(({data: { id, name, timeStamp, imageURL, read, photoURL}}) => (
                <Chat
                    id={id}
                    name={name}
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
                <header>
                    <Auth/>
                    <h1>Chat</h1>
                </header>
                <div className="block"/>
                <Chats/>
            </body>

        );
    }
}

export default Messages;