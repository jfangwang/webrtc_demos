import React from 'react';
import Webcam from "react-webcam";
import './Camera.css';
import { v4 as uuid } from "uuid";
import { storage } from "./firebase.js";



const videoConstraints = {
    facingMode: "user",
    height: window.innerHeight,
    width: window.innerWidth,
};

const sendPost = () => {
  const id = uuid();
  const uploadTask = storage
    .ref(`posts/${id}`);
    // .putString(cameraImage, 'data_url');
  console.log("Send post working");
};

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    console.log(imageSrc)
  }, [webcamRef, setImgSrc]);

  const reset = React.useCallback(() => {
    setImgSrc(imgSrc);
  }, [webcamRef, setImgSrc]);

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
      <button onClick={sendPost} class="send-to">Send to</button>
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
        );
    }
}
export default Camera;