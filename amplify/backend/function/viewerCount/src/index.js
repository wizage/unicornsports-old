/* Amplify Params - DO NOT EDIT
	API_UNICORNSPORT_CHANNELTABLE_ARN
	API_UNICORNSPORT_CHANNELTABLE_NAME
	API_UNICORNSPORT_GRAPHQLAPIENDPOINTOUTPUT
	API_UNICORNSPORT_GRAPHQLAPIIDOUTPUT
	API_UNICORNSPORT_GRAPHQLAPIKEYOUTPUT
	AUTH_UNICORNSPORT71D9C251_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/* eslint-disable */
//const AWS = require('aws-sdk');
/* eslint-enable */
//const ivsClient = new AWS.IVS({region: "us-west2"});

//import fetch from 'node-fetch'--
const {
    IvsClient,
    GetStreamCommand,
    ListChannelsCommand,
    ListStreamsCommand
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
//comment for push-2

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




    cognitoSP.adminInitiateAuth(initiateAuthParams, async function(authErr, authData) {
        if (authErr) {
            console.log("Auth err - exiting")
            console.log(authErr)
        } else {
            console.log("Auth success")

            const appSyncClient = new AWSAppSyncClient({
                disableOffline: true,
                url: GRAPHQL_ENDPOINT,
                region: 'us-west-2',
                auth: {
                    /*type: "API_KEY",
                    apiKey: 'da2-umt7iqnflfh35mmilgwpa2vitm'*/

                    type: "AMAZON_COGNITO_USER_POOLS",
                    jwtToken: authData["AuthenticationResult"]["IdToken"]
                }
            })

            const listStreamsInput = {}
            const listStreamsCommand = new ListStreamsCommand(listStreamsInput)
            const listStreamsResponse = client.send(listStreamsCommand).then(function(result) {

                console.log(result)

                result["streams"].forEach(async function(stream) {
                    console.log("loop arm")
                    console.log(stream["channelArn"])
                    arn = stream["channelArn"]

                    processStream(appSyncClient, stream.channelArn, stream.viewerCount)


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
        }

    })


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
                console.log("modify")
                console.log(result.data.channelByArn.items[0].id)
                console.log(result.data.channelByArn.items)

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