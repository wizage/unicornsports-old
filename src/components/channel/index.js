import React, { Component } from 'react';
import {
    API, graphqlOperation,
  } from 'aws-amplify';
import { FlexboxGrid, Avatar, Tag, TagGroup } from 'rsuite';

import Video from '../Video';
import NavBar from '../NavBar';
import * as queries from '../../graphql/queries';
import './index.css';

class Channel extends Component {

    constructor(props) {
        super(props);
        this.state = {
          title: 'Hello World - We out here streaming',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Morbi leo urna molestie at elementum eu. Quam lacus suspendisse faucibus interdum posuere. Diam sollicitudin tempor id eu. Auctor urna nunc id cursus metus aliquam eleifend mi in. Ut pharetra sit amet aliquam id diam. Penatibus et magnis dis parturient montes nascetur ridiculus. Aenean et tortor at risus. Commodo elit at imperdiet dui accumsan. Convallis tellus id interdum velit laoreet id donec. Lectus magna fringilla urna porttitor rhoncus dolor purus non enim. Consequat ac felis donec et. Tellus integer feugiat scelerisque varius morbi enim. Nunc faucibus a pellentesque sit amet porttitor eget dolor. Et netus et malesuada fames ac.',
          tags: ['english', 'football', 'soccer'],
        };
      }

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

    tags = () => {
        const { tags } = this.state;
        const tagHTML = tags.map((item) => (
            <Tag>{item}</Tag>
        ));
        return tagHTML;
    }


    render() {
        const { name } = this.props;
        const { title, description } = this.state;
        const profile = {name:name};
        return (
        <div className="">
            <NavBar profile={profile}/>
            <div className="videoPlayer">
                <Video 
                src={"https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.xhP3ExfcX8ON.m3u8"}
                techOrder={['AmazonIVS']}
                controls
                />
                <FlexboxGrid>
                    <FlexboxGrid.Item colspan={1}>
                        <div className="avatar">
                            <Avatar circle>{name.charAt(0).toUpperCase()}</Avatar>
                        </div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={6}>
                        <div className="channelName">
                            {name}
                        </div>
                        <div className="title">
                            {title}
                        </div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={16}>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={1}>
                        <div className="viewCount">
                            1000
                        </div>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
                <TagGroup>
                    {this.tags()}
                </TagGroup>
                <FlexboxGrid>
                    <FlexboxGrid.Item colspan={12}>
                        <div className="desc">
                            {description}
                        </div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={8}>

                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={4}>

                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        </div>
        );
    }
}



export default Channel;
