const { sns, sqs, s3 } = require('./aws-helpers')

async function ensureSqsQueue() {
  console.log(`Creating SQS Queue on ${process.env.SQS_ENDPOINT}...`)

  try {
    await sqs.client.createQueue({ QueueName: 'local-memes-queue' }).promise() // TODO: Clean up?
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function ensureSnsTopic() {
  console.log(`Creating SNS topic on ${process.env.SNS_ENDPOINT}...`)
  try {
    await sns.createTopic({ Name: 'local-memes' }).promise() // TODO: Clean up
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function ensureBucket() {
  console.log(`Creating S3 bucket on ${process.env.S3_ENDPOINT}...`)
  try {
    await s3.createBucket({ Bucket: process.env.S3_BUCKET }).promise()
  } catch (err) {
    if (err.code === 'BucketAlreadyExistsException') {
      // Stream already exists, so no problem
      console.log(`S3 bucket ${process.env.S3_BUCKET} already exists`)
      return
    }
    throw err
  }
}

async function bootstrap() {
  await ensureSqsQueue()
  await ensureSnsTopic()
  await ensureBucket()
}

// Run everything
bootstrap()
  .then(() => {
    console.log('Bootstrap succeeded')
    process.exit(0)
  })
  .catch((err) => {
    console.error(`Bootstrap failed with error ${err.stack}`)
    process.exit(1)
  })
