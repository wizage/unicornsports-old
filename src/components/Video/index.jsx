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
    window.registerIVSTech(videojs);
    this.player = videojs(this.videoNode, this.props);
    this.player.src(src);
    this.player.enableTwitchPlugins();
    const TwitchTech = this.player.getTwitchTech();
    this.player.addTwitchTechEventListener(TwitchTech.PlayerEvent.METADATA, (metadata) => {
      if (metadata.data.constructor === ArrayBuffer) {
        const enc = new TextDecoder('utf-8');
        parentCallback(enc.decode(metadata.data));
        // console.info(enc.decode(metadata.data));
      }
    });
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
