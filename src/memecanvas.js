const { s3 } = require('./aws-helpers')
const memecanvas = require('memecanvas')
const uuidv4 = require('uuid/v4')
const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const memeCanvasGenerate = util.promisify(memecanvas.generate)

memecanvas.init('/tmp', '-meme')

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomBaseImage() {
    return `./images/meme-base-${getRandomInt(0, 4)}.png`
}

async function generateAndUpload(text, s3Bucket) {
    const memeParts = text.split('.')
    const baseImage = getRandomBaseImage()
    const memeFilename = await memeCanvasGenerate(baseImage, memeParts[0], memeParts[1] || '')

    const memeFile = await readFile(memeFilename)

    const uploadResponse = await s3.upload({
        Bucket: s3Bucket,
        Key: `${uuidv4()}.png`,
        Body: memeFile,
        ACL: 'public-read'
    }).promise()

    return uploadResponse.Location
}

module.exports = {
    generateAndUpload
}
