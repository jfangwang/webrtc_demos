import React from 'react';
import Webcam from "react-webcam";
import './Camera.css';

const videoConstraints = {
    facingMode: "user",
    height: window.innerHeight,
    width: window.innerWidth,
};

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    console.log(imageSrc)
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
      {imgSrc && (
        <img
          class="capture-img"
          src={imgSrc}
        />
      )}
      <button onClick={capture} class="capture">Button</button>
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