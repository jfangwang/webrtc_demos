import React, { useEffect } from 'react';
import './Messages.css';
import { db } from './firebase';
import ReactTimeago from 'react-timeago';

function Chat({id, username, timeStamp, imageURL, read}) {
    const open = () => {
        if (!read) {
            db.collection('posts').doc(id).set({
                read: true
            },
            { merge: true }
            );
        }
    }


    return (
        <div className="Chat">
            <h4>{username}</h4>
            {/* <p>imageUrl: {imageURL}</p> */}
            {!read && <p>NEW SNAP | <ReactTimeago date={new Date(timeStamp?.toDate()).toUTCString()}/></p>}
            {read && <p>OLD SNAP</p>}
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
                    id: doc.id,
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
                {posts.map(({id, data: { username, timeStamp, imageURL, read}}) => (
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