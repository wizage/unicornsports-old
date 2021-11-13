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
const { IvsClient, GetStreamCommand, ListChannelsCommand } = require("@aws-sdk/client-ivs"); // ES Modules import
const aws = require('aws-sdk')

const axios = require('axios');
const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;

//*****************sign-in****************

const cognitoSP = new aws.CognitoIdentityServiceProvider({
  region: 'us-west-2'
})


const initiateAuthParams = {
  AuthFlow:   "ADMIN_NO_SRP_AUTH",
  ClientId:   '748ashtc1g6qcrq5cpf4tjnc8u',    // use env variables or SSM parameters
  UserPoolId: 'us-west-2_i6YTTW5z0', // use env variables or SSM parameters
  AuthParameters: {
    USERNAME: 'shamik',  // use env variables or SSM parameters
    PASSWORD: 'Shamik123#',  // use env variables or SSM parameters
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
      channelArn
      viewerCount
    }
  }
`

const createViewerCount = gql`
  mutation createChannel($input: CreateChannelInput!) {
    createChannel(input: $input) {
      title
      description
      channelID
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



/* eslint-disable */

exports.handler = async (event) => {

    const config = {
        region: "us-west-2"
    }
    
    getCredentials() 
    
    
    const client = new IvsClient(config);
    
    const listChannelsInput = {}
    const listChannelCommand = new ListChannelsCommand(listChannelsInput)
    const listChannelResponse = await client.send(listChannelCommand)
    //var listChannelResponseObject = JSON.parse(listChannelResponse)
    
    /*for(var arn in listChannelResponse["channels"]){
      console.log(arn[0])  
    }*/
    
    //console.log(listChannelResponse["channels"])
    
    //var arnList = []
    
    console.log(listChannelResponse["channels"].length)
    
    listChannelResponse["channels"].forEach(async function(channel){
      var arn = channel["arn"]
      
      const params = {
        channelArn: arn
      };
    
     
        const command = new GetStreamCommand(params);
        //console.log(streamResponse)
        
        var viewerCount = -1
        
        try{
          
          const streamResponse = await client.send(command);
          viewerCount = streamResponse["stream"]["viewerCount"]
          
        }catch (e){
          //console.log(e)
          
        }
        
        
        console.log(arn + " " + viewerCount)
        
        try {
          
          /*
          const channelExistsGraphQlData = await axios({
            url: GRAPHQL_ENDPOINT,
            method: 'post',
            headers: {
              'x-api-key': API_KEY
            },
            data: {
              query: print(getViewerCounts),
              variables: {
                channelArn: arn
              }
            }
          });
          
          console.log(channelExistsGraphQlData.data)
          
          if(!channelExistsGraphQlData.data.data.getViewerCount){
          */
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
                  channelArn: arn,
                  viewerCount: viewerCount,
                  title: "test-1",
                  description: "test-1",
                  channelID : 2
                  }
                }
              }
            });
            
            console.log(createRecord.data)
          /*  
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
                  channelArn: arn,
                  viewerCount: viewerCount
                  }
                }
              }
            });
          }
          */
        } catch (err) {
          console.log('error posting to appsync: ', err);
        }

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

function getCredentials() {
  
  
  
  return new Promise((resolve, reject) => {
    cognitoSP.adminInitiateAuth(initiateAuthParams, (authErr, authData) => {
      if (authErr) {
        console.log(authErr)
        reject(authErr)
      } else if (authData === null) {
        reject("Auth data is null")
      } else {
        console.log("Auth Successful")
        resolve(authData)
      }
    })
  })
}


exports.handler()