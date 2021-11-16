/* Amplify Params - DO NOT EDIT
	API_UNICORNSPORT_GRAPHQLAPIENDPOINTOUTPUT
	API_UNICORNSPORT_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/* eslint-disable */
//const AWS = require('aws-sdk');
/* eslint-enable */
//const ivsClient = new AWS.IVS({region: "us-west2"});

//import fetch from 'node-fetch'
const {
    IvsClient,
    GetStreamCommand,
    ListChannelsCommand
} = require("@aws-sdk/client-ivs"); // ES Modules import

const aws = require('aws-sdk')
const gql = require('graphql-tag');
const graphql = require('graphql');
var aws4 = require('aws4')
require('isomorphic-fetch')



/*import {IvsClient, GetStreamCommand, ListChannelsCommand} from '@aws-sdk/client-ivs'
import aws from 'aws-sdk'
import gql from 'graphql-tag'
import graphql from 'graphql'
import aws4 from 'aws4'
import AWSAppSyncClient from 'aws-appsync'
import createHttpLink from 'apollo-link-http'
//const axios = require('axios');

*/

const AWSAppSyncClient = require('aws-appsync').default;

//const {createHttpLink} = require('apollo-link-http')

const {
    print
} = graphql;

//*****************sign-in****************

const cognitoSP = new aws.CognitoIdentityServiceProvider({
    region: 'us-west-2'
})


const initiateAuthParams = {
    AuthFlow: "ADMIN_NO_SRP_AUTH",
    ClientId: '748ashtc1g6qcrq5cpf4tjnc8u', // use env variables or SSM parameters
    UserPoolId: 'us-west-2_i6YTTW5z0', // use env variables or SSM parameters
    AuthParameters: {
        USERNAME: 'shamik', // use env variables or SSM parameters
        PASSWORD: 'Shamik123#', // use env variables or SSM parameters
    }
};
//*****************sign-in****************


/*const GRAPHQL_ENDPOINT = "https://mmwdcbsihjf43kovagirdoa6au.appsync-api.us-west-2.amazonaws.com/graphql"
const API_KEY = "da2-momiu3347fepze2j57dj4yw7xm"
const CHANNEL_ARN = "arn:aws:ivs:us-west-2:865446119418:channel/F0xJeGNpoRd7"
*/

/*Unicorn sports endpoints*/

const GRAPHQL_ENDPOINT = "https://ntqa7znanbdb7fsqa4wzxv2rru.appsync-api.us-west-2.amazonaws.com/graphql"
const API_KEY = "	da2-umt7iqnflfh35mmilgwpa2vitm"

/*
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT
const API_KEY = process.env.API_KEY
const CHANNEL_ARN = process.env.CHANNEL_ARN
*/

//getViewerCount(channelArn: String!): viewerCount

const getViewerCounts = gql `
  query channelByArn($channelArn : String!){
    channelByArn(channelArn : $channelArn){
      items {
        channelArn
        id
        streamURL
        channelID
      }
    }
  }
`

const createViewerCount = gql`
  mutation createChannel($input: CreateChannelInput!) {
    createChannel(input: $input) {
      title
      description
      viewerCount
      channelArn
      channelID
    }
  }`


const updateViewerCount = gql`
  mutation updateChannel($input: UpdateChannelInput!) {
    updateChannel(input: $input) {
      viewerCount
      channelID
      id
    }
  }`



/* eslint-disable */

exports.handler = async (event) => {

    const config = {
        region: "us-west-2"
    }

    //console.log(creds)
    //creds = getCredentials().then(function(result){

    cognitoSP.adminInitiateAuth(initiateAuthParams, (authErr, authData) => {

        console.log("the result is ")
        console.log(authData["AuthenticationResult"]["IdToken"])

        const client = new IvsClient(config);

        const appSyncClient = new AWSAppSyncClient({
            disableOffline: true,
            url: GRAPHQL_ENDPOINT,
            region: 'us-west-2',
            auth: {
                type: "AMAZON_COGNITO_USER_POOLS",
                jwtToken: authData["AuthenticationResult"]["IdToken"]
            }
        })

        const listChannelsInput = {}
        const listChannelCommand = new ListChannelsCommand(listChannelsInput)
        const listChannelResponse = client.send(listChannelCommand).then(function(result) {
            //var listChannelResponseObject = JSON.parse(listChannelResponse)  
            //console.log("abc")
            //console.log(result)

            result["channels"].forEach(async function(channel) {
                var arn = channel["arn"]

                const params = {
                    channelArn: arn
                };

                //console.log(arn)

                const command = new GetStreamCommand(params);

                var viewerCount = -1

                try {
                    const streamResponse = await client.send(command);
                    //viewerCount = streamResponse["stream"]["viewerCount"]
                } catch (e) {
                    //console.log(e)
                }

                console.log(arn + " " + viewerCount)


                try {

                    await appSyncClient.hydrated();
                    const getViewerCountsRequest = await appSyncClient.query({
                        query: getViewerCounts,
                        fetchPolicy: 'no-cache',
                        variables: {
                            channelArn: arn
                        }
                    })

                    console.log(getViewerCountsRequest.data.channelByArn.items.length)


                    if (getViewerCountsRequest.data.channelByArn.items.length < 1) {

                        console.log("create")

                        //console.log(appSyncClient)
                        await appSyncClient.hydrated();
                        const createViewerCountRequest = await appSyncClient.mutate({
                            mutation: createViewerCount,
                            fetchPolicy: 'no-cache',
                            variables: {
                                input: {
                                    channelArn: arn,
                                    viewerCount: viewerCount,
                                    title: "test-1",
                                    description: "test-1",
                                    channelID: 2
                                }
                            }
                        })
                    } else {
                      console.log("modify")
                      console.log(getViewerCountsRequest.data.channelByArn.items[0].id)
                      console.log(getViewerCountsRequest.data.channelByArn.items)
                      
                      const modifyViewerCountRequest = await appSyncClient.mutate({
                            mutation: updateViewerCount,
                            fetchPolicy: 'no-cache',
                            variables: {
                                input: {
                                    viewerCount: viewerCount,
                                    channelID: getViewerCountsRequest.data.channelByArn.items[0].channelID,
                                    id: getViewerCountsRequest.data.channelByArn.items[0].id
                                }
                            }
                        })

                    }

                } catch (e) {
                    console.log(e)

                }

            })

        })
    })




    /*for(var arn in listChannelResponse["channels"]){
      console.log(arn[0])  
    }*/

    //console.log(listChannelResponse["channels"])

    //var arnList = []

    //console.log(listChannelResponse["channels"].length)


    const response = {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        //  headers: {
        //      "Access-Control-Allow-Origin": "*",
        //      "Access-Control-Allow-Headers": "*"
        //  }, 
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};

async function getCredentials() {
    cognitoSP.adminInitiateAuth(initiateAuthParams, (authErr, authData) => {
        if (authErr) {
            console.log(authErr)
            //reject(authErr)
        } else if (authData === null) {
            //reject("Auth data is null")
        } else {
            console.log("Auth Successful")
            console.log(authData)
            return authData
        }
    })
}

exports.handler()