import React, { Component, useEffect } from 'react';
import { storage, db, guest_id} from './firebase';
import ReactTimeago from 'react-timeago';
import './Messages.css';
import Auth from './Auth.js';
import firebase from 'firebase';
import {guest, guest_email}  from './Camera.js';

var user_list = [];
function Chat({id, name, email, timeStamp, imageURL, read, photoURL, to}) {
    const open = (id_num, read) => {
        if (!read){
          storage.ref(`posts/${id_num}`).getDownloadURL()
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
    }

    const delete_photo = () => {
      storage.ref(`posts/${id}`).delete()
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
        var user_email;
        var photo_doc;
        if (!guest) {
          user_email = firebase.auth().currentUser.email;
          photo_doc = db.collection('posts').doc(id)
          photo_doc.get().then((snapshot) => {
              user_list = snapshot.data()["to"]
              console.log("before", user_list);
              const index = user_list.indexOf(user_email);
              console.log(index);
              user_list.splice(index, 1);
              photo_doc.update({
              to: user_list
              })
              console.log("after", user_list);
              var img = document.getElementById('photo');
              img.removeAttribute('src');
              if (user_list.length == 0) {
              delete_photo();
              }
          })
        } else {
          user_email = guest_email;
          photo_doc = db.collection('posts').doc(id)
          photo_doc.get().then((snapshot) => {
              user_list = snapshot.data()["to"]
              console.log("before", user_list);
              const index = user_list.indexOf(user_email);
              console.log(index);
              user_list.splice(index, 1);
              photo_doc.update({
              to: user_list
              })
              console.log("after", user_list);
              var img = document.getElementById('photo');
              img.removeAttribute('src');
              if (user_list.length == 0) {
              delete_photo();
              }
          })
        }

    }
    var user = firebase.auth().currentUser;
    var index = 0;
    if (user) {
        // User logged in
        for (index=0;index<to.length;index++) {
            if (to[index] == user.email) {
                return (
                  <>
                    <div className="Chat" onClick={(e) => open(id, read)}>
                    <img src={photoURL} className="photoURL"/>
                    <div className="chat-info">
                            <h4>{name}</h4>
                            {!read ? <p className="status"><div className="red-block"/><p className="new-snap">New Snap</p><ReactTimeago date={new Date(timeStamp?.toDate()).toUTCString()}/></p> : <p>OPENED</p>}
                        </div>
                    </div>
                    <div>
                        <img id="photo" onClick={close}/>
                    </div>
                  </>
                )
            }

        }
    } else {
        // Guest
        for (a=0;a<to.length;a++) {
            if (to[a] == guest_email) {
                return (
                  <>
                    <div className="Chat" onClick={(e) => open(id, read)}>
                    <img src={photoURL} className="photoURL"/>
                    <div className="chat-info">
                            <h4>{name}</h4>
                            {!read ? <p className="status"><div className="red-block"/><p className="new-snap">New Snap</p><ReactTimeago date={new Date(timeStamp?.toDate()).toUTCString()}/></p> : <p>OPENED</p>}
                        </div>
                    </div>
                    <div>
                        <img id="photo" onClick={close}/>
                    </div>
                  </>
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
                <Auth/>
                <Chats/>
            </div>

        );
    }
}

export default Messages;