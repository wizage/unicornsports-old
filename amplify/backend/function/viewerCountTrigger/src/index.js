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


exports.handler = (event, context) => {

    var ruleArn = ""

    var ivsMessage = JSON.parse(event.Records[0].Sns.Message)

    if (ivsMessage["detail"]["channel_name"] == process.env.CHANNEL_NAME) {

        if (ivsMessage.detail.event_name == "Stream Start") {

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
                
                ruleArn = result.RuleArn

                const lambdaFunctionArn = context.invokedFunctionArn

                const awsAccountId = lambdaFunctionArn.split(':')[4]
                const awsRegion = lambdaFunctionArn.split(':')[3]

                var lambdaTargetInput = {
                    "Targets": [{
                        "Id": "1",
                        /** EDIT here to change the name of your function **/
                        "Arn": "arn:aws:lambda:" + awsRegion + ":" + awsAccountId + ":function:viewerCount-dev"
                    }],
                    "Rule": "viewerCountTrigger"
                }
                const putTargetCommand = new PutTargetsCommand(lambdaTargetInput)
                var putTargetResponse = client.send(putTargetCommand).then(function(targetResult) {
                    console.log(targetResult)
                })

            })

        }


        if (ivsMessage.detail.event_name == "Stream End") {

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
                

                //remove the first target (Lambda)
                const removeTargetInput = {
                    "Ids": [
                        listTargetsResponse.Targets[0].Id
                    ],
                    "Rule": "viewerCountTrigger"
                }

                var removeVCTargetCommand = new RemoveTargetsCommand(removeTargetInput)
                client.send(removeVCTargetCommand).then(function(removeTargetResult) {
                    
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

    }

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

//exports.handler()