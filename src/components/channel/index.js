import React, { Component } from 'react';
import {
    API, graphqlOperation,
  } from 'aws-amplify';

import Video from '../Video';
import * as queries from '../../graphql/queries';
import './index.css';

class Channel extends Component {

    componentDidMount() {
        const { name } = this.props;
        const input = {
            channelID: name
        };
        API.graphql(graphqlOperation(queries.getChannel, input)).then((results) => {
            this.setState({ item: results.data.getChannel });
        }).catch((e) => {
            console.log(`Error with returning, ${e} `);
        });
    }


    render() {
        const { name } = this.props;
        
        return (
        <div className="">
            Profile page for {name}!
            <Video src={"https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.xhP3ExfcX8ON.m3u8"}/>
        </div>
        );
    }
}



export default Channel;
