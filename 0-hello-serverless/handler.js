module.exports.helloServerless = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Hello Big Sky Dev Con! Time to go Serverless!' })
    }
}
