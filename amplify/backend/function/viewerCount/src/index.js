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
const { IvsClient, GetStreamCommand } = require("@aws-sdk/client-ivs"); // ES Modules import

const axios = require('axios');
const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT
const API_KEY = process.env.API_KEY
const CHANNEL_ARN = process.env.CHANNEL_ARN


//getViewerCount(channelArn: String!): viewerCount

const getViewerCounts = gql `
  query getViewerCount($CHANNEL_ARN : String!){
    getViewerCount(channelArn : $CHANNEL_ARN){
      channelArn
      viewerCount
    }
  }
`

const createViewerCount = gql`
  mutation createViewerCount($input: CreateViewerCountInput!) {
    createViewerCount(input: $input) {
      channelArn
      viewerCount
    }
  }`


const updateViewerCount = gql`
  mutation updateViewerCount($input: UpdateViewerCountInput!) {
    updateViewerCount(input: $input) {
      channelArn
      viewerCount
    }
  }`

//graphql endpoint
//https://mmwdcbsihjf43kovagirdoa6au.appsync-api.us-west-2.amazonaws.com/graphql


/* eslint-disable */

exports.handler = async (event) => {

    const config = {
        region: "us-west-2"
    }
    
    const client = new IvsClient(config);
    
    const params = {
        channelArn: CHANNEL_ARN
    };
    
    //const command = new GetStreamCommand(params);
    
    const command = new GetStreamCommand(params);
    const response1 =  client.send(command);
    
    const streamResponse = await client.send(command);
    
    console.log(streamResponse["stream"]["viewerCount"])
    
    
  try {
    const channelExistsGraphQlData = await axios({
      url: GRAPHQL_ENDPOINT,
      method: 'post',
      headers: {
        'x-api-key': API_KEY
      },
      data: {
        query: print(getViewerCounts),
        variables: {CHANNEL_ARN}
      }
    });
    
    //console.log(graphqlData.data.data.getViewerCount)
    
    if(!channelExistsGraphQlData.data.data.getViewerCount){
      console.log("create")
      
      const createRecord = await axios({
      url: GRAPHQL_ENDPOINT,
      method: 'post',
      headers: {
        'x-api-key': API_KEY
      },
      data: {
        query: print(createViewerCount),
        variables: {
          input: {
            channelArn: CHANNEL_ARN,
            viewerCount: streamResponse["stream"]["viewerCount"]
            }
          }
        }
      });
      
    } else {
      console.log("update")
      
      const updateRecord = await axios({
      url: GRAPHQL_ENDPOINT,
      method: 'post',
      headers: {
        'x-api-key': API_KEY
      },
      data: {
        query: print(updateViewerCount),
        variables: {
          input: {
            channelArn: CHANNEL_ARN,
            viewerCount: streamResponse["stream"]["viewerCount"]
            }
          }
        }
      });
    }
    
  } catch (err) {
    console.log('error posting to appsync: ', err);
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

//exports.handler()