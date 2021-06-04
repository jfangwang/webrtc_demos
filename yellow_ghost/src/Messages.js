import React, { useEffect } from 'react';
import './Messages.css';
import { db, storage } from './firebase';
import ReactTimeago from 'react-timeago';
import Auth from './Auth.js';

function Chat({id, username, timeStamp, imageURL, read}) {
    var img = document.getElementById('photo');
    const open = () => {
        const photo = storage.ref(`posts/${id}`).getDownloadURL()
        .then((url) => {
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
        img.removeAttribute('src');
    }

    return (
        <div>
            <div className="Chat" onClick={open}>
            <h4>{username}</h4>
            <p> ID: {id}</p>
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
        <div>
            <div className="nav-bar">
                CHAT
            </div>
            <div>
                {posts.map(({data: { id, username, timeStamp, imageURL, read}}) => (
                    <Chat
                        id={id}
                        username={username}
                        timeStamp={timeStamp}
                        imageURL={imageURL}
                        read={read}
                    />
                ))}
            </div>

        </div>
    )
}
class Messages extends React.Component {
    render() {
        return (
            <div>
                <Chats/>
                <Auth/>
            </div>
        );
    }
}

export default Messages;