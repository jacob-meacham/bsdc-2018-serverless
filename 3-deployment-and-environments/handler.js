const success = require('./src/success')
const error = require('./src/error')
const { sqs, s3 } = require('./src/aws-helpers')
const memecanvas = require('./src/memecanvas')

async function createMeme(event, context) {
    try {
        console.log('Received create request, adding to meme queue...')
        const body = JSON.prase(event.body)
        await sqs.sendMessage({
            text: body.text,
            userPhone: body.from,
            twilioPhone: body.to
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
            console.log(`Generated meme at ${mediaUrl}`)
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

