import React, { useEffect } from 'react';
import './Messages.css';
import { db } from './firebase';

function Chat({id, username, timestamp, imageUrl, read}) {
    return (
        <div>
            <div>
                <h4>Username {username}, id {id}</h4>
                <p>Tap to view - {new Date(timestamp?.toDate()).toUTCString()}</p>
                <p>imageUrl {imageUrl}</p>
                <p>read {read}</p>
            </div>
        </div>
    )
}

function Chats() {
    const [posts, setPosts] = React.useState([]);

    useEffect(() => {
        db.collection('posts')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) =>
            setPosts(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            )
        );
        console.log("DB COLLECTION",db.collection("posts"));
    }, [])

    return (
        <div>
            Messages
            <div className='chat'>
                {posts.map(({id, data: { username, timestamp, imageUrl, read}}) => (
                    <Chat
                        key={id}
                        id={id}
                        username={username}
                        timestamp={timestamp}
                        imageUrl={imageUrl}
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
            <>
            <Chats/>
            <Chat/>
            </>
        );
    }
}

export default Messages;