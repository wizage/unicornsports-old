import React, { Component } from 'react';
import {
    API, graphqlOperation,
  } from 'aws-amplify';
import { FlexboxGrid, Avatar, Tag, TagGroup } from 'rsuite';

import Video from '../Video';
import NavBar from '../NavBar';
import './index.css';

/* Location 8 */

class Channel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            item: {
                tags:[]
            }
        };
      }

      componentDidMount() {
        const { name } = this.props;
        const input = {
            id: name,
        };
        /* Location 8 */
    }

    tags = () => {
        const { item } = this.state;
        // Harded coded for now 
        item.tags =  ['english', 'livestream', 'coding'];
        const tagHTML = item.tags.map((item) => (
            <Tag>{item}</Tag>
        ));
        return tagHTML;
    }

    drawVideoPlayer = () => {
        const { item } = this.state;
        if (item.streamURL) {
            return (
            <Video 
                src={item.streamURL}
                techOrder={['AmazonIVS']}
                controls
                />
            );
        } else {
            return (<div></div>);
        }
    }


    render() {
        const { name } = this.props;
        const { item } = this.state;
        const profile = {name:name};
        return (
        <div className="">
            <NavBar profile={profile}/>
            <div className="videoPlayer">
                {this.drawVideoPlayer()}
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
                            {item.title}
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
                            {item.description}
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