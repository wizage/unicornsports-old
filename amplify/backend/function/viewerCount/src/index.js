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


const cognitoSP = new aws.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18',
    region: 'us-west-2'
})


const initiateAuthParams = {
    AuthFlow: "ADMIN_NO_SRP_AUTH",
    ClientId: '', // use env variables or SSM parameters
    UserPoolId: '', // use env variables or SSM parameters
    AuthParameters: {
        USERNAME: '', // use env variables or SSM parameters
        PASSWORD: '', // use env variables or SSM parameters
    }
};

const GRAPHQL_ENDPOINT = ""

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

    const client = new IvsClient(config);

    cognitoSP.adminInitiateAuth(initiateAuthParams, async function(authErr, authData) {
        if (authErr) {

        } else {

            const appSyncClient = new AWSAppSyncClient({
                disableOffline: true,
                url: GRAPHQL_ENDPOINT,
                region: 'us-west-2',
                auth: {
                    type: "AMAZON_COGNITO_USER_POOLS",
                    jwtToken: authData["AuthenticationResult"]["IdToken"]
                }
            })

            const listStreamsInput = {}
            const listStreamsCommand = new ListStreamsCommand(listStreamsInput)
            const listStreamsResponse = client.send(listStreamsCommand).then(function(result) {

                console.log(result)

                result["streams"].forEach(async function(stream) {
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