import { autocompleteClasses } from '@material-ui/core';
import React from 'react';
import Webcam from "react-webcam";
import './Camera.css';

const videoConstraints = {
  width: window.innerWidth,
  height: window.innerHeight,
  facingMode: "user",
  overflow: 'hidden'
};

class Camera extends React.Component {
    render() {
        return (
                <Webcam
                    videoConstraints={videoConstraints}
                />
        );
    }
}

export default Camera;