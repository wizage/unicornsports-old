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
const API_KEY = "da2-umt7iqnflfh35mmilgwpa2vitm"


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

exports.handler = function(event) {

    const config = {
        region: "us-west-2"
    }

    //console.log("in event handler")

    const client = new IvsClient(config);

    //console.log("the result is ")
    //console.log(authData["AuthenticationResult"]["IdToken"])



    const appSyncClient = new AWSAppSyncClient({
        disableOffline: true,
        url: GRAPHQL_ENDPOINT,
        region: 'us-west-2',
        auth: {
            type: "API_KEY",
            apiKey: 'da2-umt7iqnflfh35mmilgwpa2vitm'
        }
    })

    const promises = []

    const listChannelsInput = {}
    const listChannelCommand = new ListChannelsCommand(listChannelsInput)
    const listChannelResponse = client.send(listChannelCommand).then(function(result) {

        //console.log(result)

        result["channels"].forEach(async function(channel) {
            console.log("loop arm")
            console.log(channel["arn"])
            arn = channel["arn"]

            const params = {
                channelArn: arn
            };


            var viewerCount = -1
            const command = new GetStreamCommand(params)

            const streamResponse = client.send(command).then(function(streamResult) {
                console.log("success arn")
                console.log(streamResult)
                processStream(appSyncClient, streamResult.stream.channelArn, streamResult.stream.viewerCount)
            }, function(streamResultError) {
                //processStream(appSyncClient, arn, -1)
                console.log("error arn")
                console.log(streamResultError.$metadata)
            })
        })
    })

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

function processStream(appSyncClient, arn, viewerCount) {
    {
                console.log("arn in processSteam")
                console.log(arn)

                appSyncClient.hydrated();
                const getViewerCountsRequest = appSyncClient.query({
                    query: getViewerCounts,
                    fetchPolicy: 'no-cache',
                    variables: {
                        channelArn: arn
                    }
                }).then(function(result) {
                    //console.log("query result")
                    //console.log(result.data.channelByArn.items)

                    if (result.data.channelByArn.items.length < 1) {
                        console.log("create")

                        //console.log(appSyncClient)
                        appSyncClient.hydrated();
                        const createViewerCountRequest = appSyncClient.mutate({
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
                        //console.log("modify")
                        //console.log(result.data.channelByArn.items[0].id)
                        //console.log(result.data.channelByArn.items)

                        const modifyViewerCountRequest = appSyncClient.mutate({
                            mutation: updateViewerCount,
                            fetchPolicy: 'no-cache',
                            variables: {
                                input: {
                                    viewerCount: viewerCount,
                                    id: result.data.channelByArn.items[0].id
                                }
                            }
                        })

                    }
                })
            }
}

exports.handler()