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
    
    console.log(event.Records[0].Sns.Message)
    
    var ivsMessage = JSON.parse(event.Records[0].Sns.Message)
    
    console.log(ivsMessage.detail)
    

    if(ivsMessage["detail"]["channel_name"] == process.env.CHANNEL_NAME){

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
            console.log(result)
            console.log(result.RuleArn)

            ruleArn = result.RuleArn
            
            const lambdaFunctionArn = context.invokedFunctionArn

            const awsAccountId = lambdaFunctionArn.split(':')[4]
            const awsRegion = lambdaFunctionArn.split(':')[3]
    
            console.log(awsAccountId)

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
            console.log(listTargetsResponse)

            //remove the first target (Lambda)
            const removeTargetInput = {
                "Ids": [
                    listTargetsResponse.Targets[0].Id
                ],
                "Rule": "viewerCountTrigger"
            }

            var removeVCTargetCommand = new RemoveTargetsCommand(removeTargetInput)
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

    }
    
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

//exports.handler()