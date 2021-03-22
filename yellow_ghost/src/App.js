import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import './App.css';
import Messages from './Messages.js';
import Camera from './Camera.js';

const styles = {
  slide: {
    color: '#fff',
    height: window.innerHeight,
    width: window.innerWidth
  },
  slide1: {
    background: '#FEA900',
  },
  slide2: {
    background: '#B3DC4A',
  },
  slide3: {
    background: '#6AC0FF',
  }
};

class App extends React.Component {
  state = {
    index: 0,
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
      <SwipeableViews index={index} onChangeIndex={this.handleChangeIndex} enableMouseEvents>
        <div style={Object.assign({}, styles.slide, styles.slide1)} className="messages"><Messages /></div>
        <div style={Object.assign({}, styles.slide, styles.slide2)} className="camera"><Camera /></div>
        <div style={Object.assign({}, styles.slide, styles.slide3)} className="discover">Discover</div>
      </SwipeableViews>
    );
  }
}

export default App;
