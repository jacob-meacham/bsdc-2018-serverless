const success = require('./src/success')
const error = require('./src/error')
const { sqs, s3 } = require('./src/aws-helpers')
const memecanvas = require('./src/memecanvas')
const twilio = require('twilio')

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_ACCOUNT_AUTH_TOKEN)

async function createMeme(event, context) {
    try {
        console.log('Received create request, adding to meme queue...')
        await sqs.sendMessage({
            text: event.queryStringParameters.Body,
            userPhone: event.queryStringParameters.From,
            twilioPhone: event.queryStringParameters.To
        },
        process.env.SQS_QUEUE_URL)

        return success()
    } catch (err) {
        console.log(err)
        return error('Error queueing up meme creation.')
    }
}

async function sendMeme(event, context) {
    try {
        const messages = await sqs.handleMessages(process.env.SQS_QUEUE_URL)
        for (const message of messages) {
            console.log(`Generating image from: ${message.text}...`)
            const mediaUrl = await memecanvas.generateAndUpload(message.text, process.env.S3_BUCKET)
            console.log(`Sending ${mediaUrl} via twilio...`)
            const twilioRes = await twilioClient.messages.create({
                body: 'BSDC 2018 Serverless Meme',
                from: message.twilioPhone,
                mediaUrl,
                to: message.userPhone,
            })
        }
    } catch (err) {
        console.log(err)
        console.log('Error sending meme!')
    }
}

module.exports = {
    createMeme,
    sendMeme
}

