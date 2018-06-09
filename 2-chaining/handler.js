const success = require('./src/success')
const error = require('./src/error')
const { sqs, s3 } = require('./src/aws-helpers')

async function createMeme(event, context) {
    try {
        console.log('Received create request, adding to meme queue...')
        const body = JSON.parse(event.body)
        await sqs.sendMessage({
            text: body.text,
            userPhone: body.from,
            twilioPhone: body.to
        },
        'https://sqs.us-east-1.amazonaws.com/770772978315/static-meme-sqs',
        'arn:aws:sns:us-east-1:770772978315:static-meme-topic')

        return success()
    } catch (err) {
        console.log(err)
        return error('Error queueing up meme creation.')
    }
}

async function sendMeme(event, context) {
    try {
        const messages = await sqs.handleMessages('https://sqs.us-east-1.amazonaws.com/770772978315/static-meme-sqs')
        for (const message of messages) {
            console.log(`TODO: Create a meme image with text "${message.text}" and then ship it off to ${messageBody.userPhone}`)
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

curl -XPOST https://g77f61p490.execute-api.us-east-1.amazonaws.com/dev/meme
-d '{ "text": "AllYourBase", "from": "+14065468680", "to": "+15555555555"}'


