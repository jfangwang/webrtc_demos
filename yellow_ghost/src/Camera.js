import React from 'react';
import Webcam from "react-webcam";
import './Camera.css';
import { v4 as uuid } from "uuid";
import { db, storage } from "./firebase.js";
import firebase from 'firebase';


const videoConstraints = {
    facingMode: "user",
    height: window.innerHeight,
    width: window.innerWidth,
};

const ReactFireBaseUpload = () => {
  const [image, setImage] = React.useState(null);
  const handleChange = e => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  };
  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      snapshot => {},
      error => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            console.log(url);
          })
      }
    )
  };
  console.log("image: ", image);
  return (
    <div>
      <input class="file-upload" type="file" onChange={handleChange}/>
      <button onClick={handleUpload}>upload</button>
    </div>
  );
}

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const reset_img = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    console.log(webcamRef)
  }, [webcamRef, setImgSrc]);

  const reset = React.useCallback(() => {
    setImgSrc(reset_img);
  }, [webcamRef, setImgSrc]);

  const sendPost = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    const id = uuid();
    const uploadTask = storage.ref(`posts/${id}`).putString(imageSrc, 'data_url');
    uploadTask.on(
      "state_changed",
      snapshot => {},
      error => {
        console.log(error);
      },
      () => {
        storage
          .ref("posts")
          .child(id)
          .getDownloadURL()
          .then(url => {
            console.log(url);
            db.collection('posts').add({
              imageURL: url,
              username: "JFANGWANG",
              read: false,
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
          })
      }
    )
  };

  return (
    <div class="body">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        mirrored={true}
      />
      <img
          class="capture-img"
          src={imgSrc}
        />
      <button onClick={reset} class="reset">reset</button>
      <button onClick={capture} class="capture">Caputure</button>
      <button onClick={sendPost} class="send-to">Send</button>
    </div>
  );
};
class Camera extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            height: 0,
            width: 0
        };
        window.addEventListener("resize", this.update);
    }

    componentDidMount() {
        this.update();
    }

    update = () => {
        this.setState ({
            height: window.innerHeight,
            width: window.innerWidth,
        });
    };

    render() {
        return (
            // <div class="body">
            //     <Webcam
            //         videoConstraints={videoConstraints}
            //         height={this.state.height}
            //         width={this.state.width}
            //         mirrored={true}
            //     />
            //     <button class="capture"></button>
            // </div>
            <WebcamCapture/>
            //<ReactFireBaseUpload/>
        );
    }
}
export default Camera;