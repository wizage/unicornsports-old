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



const AWSAppSyncClient = require('aws-appsync').default;


const {
    print
} = graphql;

//*****************sign-in****************

const cognitoSP = new aws.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18',
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



/*Unicorn sports endpoints*/

const GRAPHQL_ENDPOINT = "https://ntqa7znanbdb7fsqa4wzxv2rru.appsync-api.us-west-2.amazonaws.com/graphql"
const API_KEY = "	da2-umt7iqnflfh35mmilgwpa2vitm"


const getViewerCounts = gql `
  query channelByArn($channelArn : String!){
    channelByArn(channelArn : $channelArn){
      items {
        channelArn
        id
        streamURL
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
    }
  }`


const updateViewerCount = gql`
  mutation updateChannel($input: UpdateChannelInput!) {
    updateChannel(input: $input) {
      viewerCount
      id
    }
  }`



/* eslint-disable */

exports.handler = async function(event) {

    const config = {
        region: "us-west-2"
    }

    console.log("in event handler")
    
    const client = await new IvsClient(config);
    
    const listChannelsInput = {}
                const listChannelCommand = await new ListChannelsCommand(listChannelsInput)
                const listChannelResponse = await client.send(listChannelCommand).then(async function(result) {
                  console.log("channel result")
                  console.log(result)  
                })

    try {
            await cognitoSP.adminInitiateAuth(initiateAuthParams, async function(authErr, authData) {

            if (authErr) {
                console.log(authErr, authErr.stack)
            } else {

                console.log("the result is ")
                console.log(authData["AuthenticationResult"]["IdToken"])

                

                const appSyncClient = await new AWSAppSyncClient({
                    disableOffline: true,
                    url: GRAPHQL_ENDPOINT,
                    region: 'us-west-2',
                    auth: {
                        type: "AMAZON_COGNITO_USER_POOLS",
                        jwtToken: authData["AuthenticationResult"]["IdToken"]
                    }
                })

                const listChannelsInput = {}
                const listChannelCommand = await new ListChannelsCommand(listChannelsInput)
                const listChannelResponse = await client.send(listChannelCommand).then(async function(result) {
                    //var listChannelResponseObject = JSON.parse(listChannelResponse)  
                    //console.log("abc")
                    //console.log(result)

                    result["channels"].forEach(async function(channel) {
                        var arn = channel["arn"]

                        const params = {
                            channelArn: arn
                        };

                        console.log(arn)

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

                            console.log("hydrating the appclient")

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

                                console.log(appSyncClient)
                                await appSyncClient.hydrated();
                                const createViewerCountRequest = await appSyncClient.mutate({
                                    mutation: createViewerCount,
                                    fetchPolicy: 'no-cache',
                                    variables: {
                                        input: {
                                            channelArn: arn,
                                            viewerCount: viewerCount,
                                            title: "test-1",
                                            description: "test-1"
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
            }
        })
    } catch (e) {
        console.log(e)
    }

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

exports.handler()