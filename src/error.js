function error(message, err) {
    console.error(message)

    const response = {
        statusCode: 500,
        message
    }

    if (err) {
        response.err = err
    }

    return response
}

module.exports = error
