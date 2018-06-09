function success(message) {
    if (message) {
        console.log(message)
        return {
            statusCode: 200,
            message
        }
    }

    return {
        statusCode: 200
    }
}

module.exports = success
