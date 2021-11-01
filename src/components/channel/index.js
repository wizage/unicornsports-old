import React, { Component } from 'react';
import {
    API, graphqlOperation,
  } from 'aws-amplify';
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

        </div>
        );
    }
}



export default Channel;
