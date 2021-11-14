import React, { Component } from 'react';
import {
    API, graphqlOperation, Auth
  } from 'aws-amplify';
import { Form, TagInput, InputGroup, ButtonToolbar, Button } from 'rsuite';
import ReloadIcon from '@rsuite/icons/Reload';
import { createChannel, updateChannel, createStreamKey } from '../../graphql/mutations';
import NavBar from '../NavBar';
import { getChannel } from '../../graphql/queries';
import './index.css';

class ChannelAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newChannel: true,
            item: {},
            user: {}
        }
    }

    componentDidMount() {
        const { name } = this.props;
        const input = {
            id: name,
        };

        Auth.currentAuthenticatedUser().then((userInfo) => {
            this.setState({user: userInfo});
        });
        try {
            API.graphql(graphqlOperation( getChannel, input)).then((results) => {
                if(results.data.getChannel) {
                    this.setState({ item: results.data.getChannel, newChannel: false });
                }
            });
        } catch (e) {
            console.log("Channel can't be found");
        }
    }

    setFormValue = (formValue) => {
        this.setState({
            item: formValue
        });
    }

    submit = async (valid) => {
        const { item, user, newChannel } = this.state;
        console.log(item);
        if (valid){
            const channelInput = {
                id: user.username,
                title: item.title,
                description: item.description,
            };
            try {
                if (newChannel) {
                    await API.graphql(graphqlOperation(createChannel, {input: channelInput}));
                    this.setState({newChannel: false});
                    console.log('Create new channel');
                } else {
                    await API.graphql(graphqlOperation(updateChannel, {input: channelInput}));
                    this.setState({newChannel: false});
                    console.log('Updating new channel');
                }
                
            } catch (err){
                if(err.errors[0].errorType === 'DynamoDB:ConditionalCheckFailedException'){
                    
                } else {
                    
                }
            }
        }
    }

    generateKey = async () => {
        const { newChannel, user } = this.state;
        if (!newChannel) {
            try {
                API.graphql(graphqlOperation(createStreamKey, {id: user.username})).then((results) => {
                    console.log('Create stream key');
                    this.setState({item: results.data.createStreamKey});
                });
            } catch (err){
                if(err.errors[0].errorType === 'DynamoDB:ConditionalCheckFailedException'){
                    
                } else {
                    
                }
            }
        } else {
            //Show error 
        }
    }
    

    render() {
        const { user, item } = this.state;
        return (
        <div className="">
            <NavBar profile={user.username}/>
            <div className="formHolder">
                <Form 
                onChange={formValue=> this.setFormValue(formValue)}
                onSubmit={this.submit}
                formValue={item}
                fluid>
                    <Form.Group controlId="id">
                        <Form.ControlLabel>Channel Name</Form.ControlLabel>
                        <Form.Control name="id" readOnly  value={user.username}/>
                        <Form.HelpText>Channel Name is auto created</Form.HelpText>
                    </Form.Group>
                    <Form.Group controlId="title">
                        <Form.ControlLabel>Stream Titile</Form.ControlLabel>
                        <Form.Control name="title" />
                        <Form.HelpText>Stream Title is required</Form.HelpText>
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.ControlLabel>Stream Description</Form.ControlLabel>
                        <Form.Control name="description" />
                        <Form.HelpText>Stream Description is required</Form.HelpText>
                    </Form.Group>
                    <Form.Group controlId="tags">
                        <Form.ControlLabel>Stream Tags</Form.ControlLabel>
                        <Form.Control name="tags" accepter={TagInput}  style={{ width: '100%' }} />
                        <Form.HelpText>Press enter to create a new tag</Form.HelpText>
                    </Form.Group>
                    <Form.Group controlId="ingestEndpoint">
                        <Form.ControlLabel>Ingest Endpoint</Form.ControlLabel>
                        <Form.Control name="ingestEndpoint" readOnly value={item.ingestEndpoint?`rtmps://${item.ingestEndpoint}:443/app/`:''} />
                        <Form.HelpText>Auto generated.</Form.HelpText>
                    </Form.Group>
                    <Form.Group controlId="streamKey">
                        <Form.ControlLabel>Stream Key</Form.ControlLabel>
                        <InputGroup style={{ width: '100%' }}>
                            <Form.Control name="streamKey" readOnly />
                            <InputGroup.Button onClick={this.generateKey}>
                                <ReloadIcon color="#3498FF"/>
                            </InputGroup.Button>
                        </InputGroup>
                        <Form.HelpText>Auto Generated. Click the key to generate one</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <ButtonToolbar>
                            <Button appearance="primary" type="Update">Submit</Button>
                        </ButtonToolbar>
                    </Form.Group>
                </Form>
            </div>
        </div>
        );
    }
}



export default ChannelAdmin;
