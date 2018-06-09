## Introduction
This is the code and documentation that accompanies the Big Sky Dev Con 2018 presentation "Building a Serverless Backend". During this presentation, we built an SMS/MMS-based meme generator service.

## Quick Start
First, put your twilio creds into  4-memegen/config/deploy.yml. Then:
```
npm install
cp -R lambda-native-canvas/node_modules/lambda-canvas node_modules/
cd 4-memegen
npx sls deploy --stage develop
```

## Project Layout
Each step taken in the presentation is laid out in a numbered folder. I organized the repo this way so that you can easily flip back and forth between implementations. This structure relies on appropriate symlinks - if your operating system doesn't handle symlinks well, you may need to copy `node_modules`, `src`, `lib`, `images`, `package.json`, `serverless.json` into the subdirectories

* 0-hello-serverless - The initial Hello World serverless function
* 1-http-and-debugging - A Lambda invoked via HTTP and debugging
* 2-chaining - A lambda chained to another via SNS and SQS
* 3-deployment-and-environments - Full environments, full local debugging
* 4-memegen - The full service

## Running Locally
Running locally is a bit more involved than running in the cloud:

### Prerequisites
* [brew](https://brew.sh/)
* node 8+
* Python 3
* [pipenv](https://github.com/pypa/pipenv)

### Steps
```
npm i
npm i -g serverless # or you can use npx
cp -R lambda-native-canvas/node_modules/lambda-canvas node_modules/
brew install cairo # necessary for node-canvas
pipenv install --dev # for localstack
SERVICES=s3,sqs,sns pipenv run localstack start
cd 4-memegen/
# The next command builds the localstack resources
sls runWithEnvironment --command 'node src/local-bootstrap.js' --stage local
```

Once this is all complete, you should be able to run with
```
sls offline start
```

Alternatively, you can use the [VSCode](https://code.visualstudio.com/) to debug your lambdas. Simply use the Serverless Offline debug target.

### Other Directories
* images/ - the meme images. Feel free to add your own!
* src/ - Library code
* lambda-native-canvas/ - A build of canvas against the linux runtime used by Lambda
