## Introduction
This is the code and documentation that accompanies the Big Sky Dev Con 2018 presentation "Building a Serverless Backend". During this presentation, we built an SMS/MMS-based meme generator service.

![Meme](meme.png?raw=true "Meme")

Code can be found at [https://github.com/jacob-meacham/bsdc-2018-serverless](https://github.com/jacob-meacham/bsdc-2018-serverless)

<iframe src="//www.slideshare.net/slideshow/embed_code/key/LLWfCRh0hIlB9J" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/JacobMeacham/big-sky-dev-con-2018-building-a-serverless-backend-103051655" title="Big Sky Dev Con 2018 - Building a Serverless Backend" target="_blank">Big Sky Dev Con 2018 - Building a Serverless Backend</a> </strong> from <strong><a href="https://www.slideshare.net/JacobMeacham" target="_blank">Jacob Meacham</a></strong> </div>

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
