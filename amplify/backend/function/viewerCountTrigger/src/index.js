const aws = require('aws-sdk')

const {
    EventBridgeClient,
    PutRuleCommand,
    ActivateEventSourceCommand,
    PutTargetsCommand,
    DeleteRuleCommand,
    ListTargetsByRuleCommand,
    RemoveTargetsCommand
} = require("@aws-sdk/client-eventbridge");


exports.handler = (event) => {


    /* Sample start event 
    
    2021-11-17T20:37:17.450Z	adda3d05-9e30-4972-a2d0-aaf66bac9bf9	INFO	{
  version: '0',
  id: '91d26b2c-c6f8-5c0a-eeb5-a0bf46c68535',
  'detail-type': 'IVS Stream State Change',
  source: 'aws.ivs',
  account: '093612047732',
  time: '2021-11-17T20:37:15Z',
  region: 'us-west-2',
  resources: [ 'arn:aws:ivs:us-west-2:093612047732:channel/8cuAovVoLwT4' ],
  detail: {
    event_name: 'Stream Start',
    channel_name: 'shams1',
    stream_id: 'st-1Gjd0CTQt8zpoekwE7RwpPW'
  }
}

*/

    /*Sample End event

    17eccde7-a816-40c6-b159-7e637cfa8200	INFO	{
      version: '0',
      id: '955502d3-56f3-b763-027f-1ae744d5c001',
      'detail-type': 'IVS Stream State Change',
      source: 'aws.ivs',
      account: '093612047732',
      time: '2021-11-17T20:37:47Z',
      region: 'us-west-2',
      resources: [ 'arn:aws:ivs:us-west-2:093612047732:channel/8cuAovVoLwT4' ],
      detail: {
        event_name: 'Stream End',
        channel_name: 'shams1',
        stream_id: 'st-1Gjd0CTQt8zpoekwE7RwpPW'
      }
    */
    ruleArn = ""

    if (event.detail.event_name == "Stream Start") {

        const startTriggerRuleInput = {
            "Description": "rule to start stop viewerCount Execution",
            "EventBusName": "default",
            "Name": "viewerCountTrigger",
            "ScheduleExpression": "rate(1 minute)",
            "State": "ENABLED"
        }

        const client = new EventBridgeClient({
            region: "us-west-2"
        });

        const startTriggerRuleCommand = new PutRuleCommand(startTriggerRuleInput)
        const startTriggerResponse = client.send(startTriggerRuleCommand).then(function(result) {
            console.log(result)
            console.log(result.RuleArn)

            ruleArn = result.RuleArn

            lambdaTargetInput = {
                "Targets": [{
                    "Id": "1",
                    "Arn": "arn:aws:lambda:us-west-2:093612047732:function:viewerCount-dev"
                }],
                "Rule": "viewerCountTrigger"
            }
            const putTargetCommand = new PutTargetsCommand(lambdaTargetInput)
            putTargetResponse = client.send(putTargetCommand).then(function(targetResult) {
                console.log(targetResult)
            })



        })

    }


    if (event.detail.event_name == "Stream End") {

        const client = new EventBridgeClient({
            region: "us-west-2"
        });

        /* first list targets 
        delete all the targets for the rule
        delete rule */

        const listViewerCountTargetsInput = {
            "Rule": "viewerCountTrigger"
        }
        const listViewerCountTargetsCommand = new ListTargetsByRuleCommand(listViewerCountTargetsInput)
        const listViewerCountTargetsResponse = client.send(listViewerCountTargetsCommand).then(function(listTargetsResponse) {
            console.log(listTargetsResponse)

            //remove the first target (Lambda)
            const removeTargetInput = {
                "Ids": [
                    listTargetsResponse.Targets[0].Id
                ],
                "Rule": "viewerCountTrigger"
            }

            removeVCTargetCommand = new RemoveTargetsCommand(removeTargetInput)
            client.send(removeVCTargetCommand).then(function(removeTargetResult) {
                console.log(removeTargetResult)
                /* now remove the rule */
                const deleteRuleInput = {
                    "Force": true,
                    "Name": "viewerCountTrigger"
                }

                const deleteTriggerRuleCommand = new DeleteRuleCommand(deleteRuleInput)
                const deleteRuleResponse = client.send(deleteTriggerRuleCommand).then(function(deleteResult) {
                    console.log(deleteResult)
                })

            })
        })

    }


    const client = new EventBridgeClient({
        region: "us-west-2"
    });



    console.log(event);


    // TODO implement--
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

exports.handler({
    version: '0',
    id: '955502d3-56f3-b763-027f-1ae744d5c001',
    'detail-type': 'IVS Stream State Change',
    source: 'aws.ivs',
    account: '093612047732',
    time: '2021-11-17T20:37:47Z',
    region: 'us-west-2',
    resources: ['arn:aws:ivs:us-west-2:093612047732:channel/8cuAovVoLwT4'],
    detail: {
        event_name: 'Stream End',
        channel_name: 'shams1',
        stream_id: 'st-1Gjd0CTQt8zpoekwE7RwpPW'
    }
})