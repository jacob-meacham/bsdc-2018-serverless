const AWS = require('aws-sdk')

if (process.env.S3_FORCE_PATH_STYLE) {
  // For local development, we want to use path styles only
  AWS.config.s3ForcePathStyle = true
}

function defaultClientParams(endpoint, useSsl) {
  const params = {
    region: 'us-east-1'
  }
  if (endpoint) {
    params.endpoint = endpoint
  }

  if (useSsl === 'true') {
    params.sslEnabled = true
  }

  return params
}

const S3_CLIENT = new AWS.S3({ ...{ apiVersion: '2006-03-01' }, ...defaultClientParams(process.env.S3_ENDPOINT, process.env.AWS_USE_SSL)})
const SNS_CLIENT = new AWS.SNS({ ...{ apiVersion: '2010-03-31' }, ...defaultClientParams(process.env.SNS_ENDPOINT, process.env.AWS_USE_SSL)})
const SQS_CLIENT = new AWS.SQS({ ...{ apiVersion: '2012-11-05' }, ...defaultClientParams(process.env.SQS_ENDPOINT, process.env.AWS_USE_SSL)})

async function sqsSendMessage(body, queueUrl, snsTopic) {
  await SQS_CLIENT.sendMessage({
    MessageBody: JSON.stringify(body),
    QueueUrl: queueUrl
  }).promise()

  const topic = snsTopic ? snsTopic : process.env.SNS_TOPIC

  await SNS_CLIENT.publish({
        Message: "DataReady",
        TopicArn: topic
    }).promise()
}

async function sqsHandleMessages(queueUrl) {
  const messages = []
  const data = await SQS_CLIENT.receiveMessage({
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 5,
    QueueUrl: queueUrl
  }).promise()

  if (data.Messages) {
    for (const message of data.Messages) {
      await SQS_CLIENT.deleteMessage({
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle
      }).promise()

      messages.push(JSON.parse(message.Body))
    }
  }

  return messages
}


// N.B. This lets us keep the demo code a little cleaner, although of course
// in practice you'd use the real clients.
module.exports = {
  s3: S3_CLIENT,
  sns: SNS_CLIENT,
  sqs: {
    sendMessage: sqsSendMessage,
    handleMessages: sqsHandleMessages,
    client: SQS_CLIENT
  }
}
