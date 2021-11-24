/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-env browser */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './index.css';

class Video extends Component {
  
  componentDidMount() {
    const { src, parentCallback } = this.props;
    /* Location 11 */
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div>
        <div data-vjs-player className="video-container">
          <video ref={(node) => { this.videoNode = node; }} className="video-js" />
        </div>
      </div>
    );
  }
}

export default Video;

Video.propTypes = {
  src: PropTypes.string.isRequired,
  parentCallback: PropTypes.func.isRequired,
};
