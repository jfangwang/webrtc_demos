import React from 'react';
import Webcam from "react-webcam";
import './Camera.css';

const videoConstraints = {
  facingMode: {exact: "environment"},
};

class Camera extends React.Component {
    render() {
        return (
                <Webcam
                    videoConstraints={videoConstraints}
                    height={window.innerHeight}
                    screenshotFormat='image/jpeg'
                />
        );
    }
}

export default Camera;