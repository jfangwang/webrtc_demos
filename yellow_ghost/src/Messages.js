import React, { useEffect } from 'react';
import './Messages.css';
import { db } from './firebase';

function Chat({id, username, timeStamp, imageURL, read}) {
    return (
        <div>
            <div>
                <h4>Username: {username}</h4>
                <p>Tap to view - {new Date(timeStamp?.toDate()).toUTCString()}</p>
                <p>imageUrl: {imageURL}</p>
                {!read && <p>Read status: NEW</p>}
                {read && <p>Read status: OLD</p>}
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
                    id: doc.id,
                    data: doc.data(),
                }))
            )
        );
    }, [])

    return (
        <div>
            <div className='chat'>
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