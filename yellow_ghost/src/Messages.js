import React, { useEffect } from 'react';
import './Messages.css';
import { db, storage } from './firebase';
import ReactTimeago from 'react-timeago';

function Chat({id, username, timeStamp, imageURL, read}) {
    var opened = false;
    const open = () => {
        const photo = storage.ref(`posts/${id}`).getDownloadURL()
        .then((url) => {
            var img = document.getElementById('photo');
            img.setAttribute('src', url);
            opened = true;
        })
        .catch((error) => {
            // Handle any errors
            console.log("COULD NOT GET PHOTO")
        });
        // if (!read) {
        //     db.collection('posts').doc(id).set({
        //         read: true
        //     },
        //     { merge: true }
        //     );
        // }
    }

    const close = () => {
        const photo = storage.ref(`posts/${id}`).delete()
        .then((url) => {
            var img = document.getElementById('photo');
            img.setAttribute('src', url);
            console.log("PHOTO DELETED")
        })
        .catch((error) => {
            // Handle any errors
            console.log("COULD NOT GET PHOTO")
        });
    }

    return (
        <div>
            <div className="Chat">
            <h4>{username}</h4>
            <p> ID: {id}</p>
            {!read && <p>NEW SNAP | <ReactTimeago date={new Date(timeStamp?.toDate()).toUTCString()}/></p>}
            {read && <p>OPENED</p>}
            <button onClick={open}>open</button>
            <button onClick={close} className="close">close</button>
            <img
            id="photo"
            />
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
            </div>
        );
    }
}

export default Messages;