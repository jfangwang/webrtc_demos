import React from 'react';
import Helmet from 'react-helmet';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import './App.css';
import Messages from './Messages.js';
import Camera from './Camera.js';
import FaceDetection from './FaceDetection.js';

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

const styles = {
  slide: {
    color: '#fff',
  },
  slide1: {
    background: 'MediumSeaGreen',
  },
  slide2: {
    background: 'ForestGreen',
  },
  slide3: {
    background: 'DodgerBlue',
  },
  slide4: {
    background: 'DeepPink',
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      height: window.innerHeight,
      width: window.innerWidth
    };
    window.addEventListener("resize", this.update);
  }

  componentDidMount() {
    this.update();
  }

  update = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  handleChange = (event, value) => {
    this.setState({
      index: value,
    });
  };

  handleChangeIndex = index => {
    this.setState({
      index,
    });
  };

  render() {
    const { index } = this.state;
    return (
      <BindKeyboardSwipeableViews style={Object.assign({width: this.state.width, height: this.state.height})} index={index} onChangeIndex={this.handleChangeIndex} enableMouseEvents ignoreNativeScroll='true'>
        <div style={Object.assign({width: this.state.width, height: this.state.height}, styles.slide, styles.slide1)} className="messages">
          <Helmet>
            <meta name="viewport" content="height=device-height, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
          </Helmet>
          <Messages />
        </div>
        <div style={Object.assign({width: this.state.width, height: this.state.height}, styles.slide, styles.slide3)} className="camera">
          <Helmet>
            <meta name="viewport" content="height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
          </Helmet>
          <Camera />
        </div>
        <div style={Object.assign({width: this.state.width, height: this.state.height}, styles.slide, styles.slide2)} className="faceDetection">
          <Helmet>
            <meta name="viewport" content="height=device-height, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
          </Helmet>
          <FaceDetection />
        </div>
        <div style={Object.assign({width: this.state.width, height: this.state.height}, styles.slide, styles.slide4)} className="discover">
          <Helmet>
            <meta name="viewport" content="height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
          </Helmet>
          <p>Discover</p>
        </div>
      </BindKeyboardSwipeableViews>
    );
  }
}

export default App;
