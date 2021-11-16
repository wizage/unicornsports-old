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
    window.registerIVSQualityPlugin(videojs); // where videojs is the video.js variable
    this.player = videojs(this.videoNode, this.props);
    this.player.src(src);
    this.player.enableIVSQualityPlugin(); // where player is the instance of the videojs player
    const PlayerState = this.player.getIVSEvents().PlayerState;
    const PlayerEventType = this.player.getIVSEvents().PlayerEventType;
    this.player.getIVSPlayer().addEventListener(PlayerEventType.TEXT_METADATA_CUE, (metadata) => {
      console.log(metadata.text)
    });
    this.player.getIVSPlayer().addEventListener(PlayerState.PLAYING, () => {
      console.log("Player State - PLAYING");
      setTimeout(() => {
          console.log(
              `This stream is ${
                  this.player.getIVSPlayer().isLiveLowLatency() ? "" : "not "
              }playing in ultra low latency mode`
          );
          console.log(`Stream Latency: ${this.player.getIVSPlayer().getLiveLatency()}s`);
      }, 5000);
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
