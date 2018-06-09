module.exports.createMeme = async (event, context) => {
    console.log('Received create request, adding to meme queue...')
    return {
        statusCode: 200,
        body: JSON.stringify({message: `We'll get right on creating ${event.meme || 'a meme'}!`})
        // body: JSON.stringify({message: `We'll get right on creating ${event.queryStringParameters.meme}!`})
    }
}
