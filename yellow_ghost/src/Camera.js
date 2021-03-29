import React from 'react';
import Webcam from "react-webcam";
import './Camera.css';

const videoConstraints = {
    facingMode: "user",
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
                <Webcam
                    videoConstraints={videoConstraints}
                    height={this.state.height}
                    width={this.state.width}
                />
        );
    }
}
export default Camera;