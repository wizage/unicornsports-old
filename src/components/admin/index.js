import React, { Component } from 'react';
import {
    API, graphqlOperation,
  } from 'aws-amplify';
import { Form, TagInput, InputGroup } from 'rsuite';
import ReloadIcon from '@rsuite/icons/Reload';

import NavBar from '../NavBar';
import * as queries from '../../graphql/queries';
import './index.css';

class ChannelAdmin extends Component {

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
        const profile = {name:name};
        return (
        <div className="">
            <NavBar profile={profile}/>
            <div className="formHolder">
                <Form fluid>
                    <Form.Group controlId="channelName">
                        <Form.ControlLabel>Channel Name</Form.ControlLabel>
                        <Form.Control name="channelName" />
                        <Form.HelpText>Channel Name is required</Form.HelpText>
                    </Form.Group>
                    <Form.Group controlId="streamTitle">
                        <Form.ControlLabel>Stream Titile</Form.ControlLabel>
                        <Form.Control name="streamTitle" />
                        <Form.HelpText>Stream Title is required</Form.HelpText>
                    </Form.Group>
                    <Form.Group controlId="streamDesc">
                        <Form.ControlLabel>Stream Description</Form.ControlLabel>
                        <Form.Control name="streamDesc" />
                        <Form.HelpText>Stream Description is required</Form.HelpText>
                    </Form.Group>
                    <Form.Group controlId="tags">
                        <Form.ControlLabel>Stream Tags</Form.ControlLabel>
                        <Form.Control name="tags" accepter={TagInput}  style={{ width: '100%' }} />
                        <Form.HelpText>Press enter to create a new tag</Form.HelpText>
                    </Form.Group>
                    <Form.Group controlId="streamKey">
                        <Form.ControlLabel>Stream Key</Form.ControlLabel>
                        <InputGroup style={{ width: '100%' }}>
                            <Form.Control name="streamKey" readOnly />
                            <InputGroup.Button>
                                <ReloadIcon color="#3498FF"/>
                            </InputGroup.Button>
                        </InputGroup>
                        <Form.HelpText>Auto Generated. Click the key to generate one</Form.HelpText>
                    </Form.Group>
                </Form>
            </div>
        </div>
        );
    }
}



export default ChannelAdmin;
