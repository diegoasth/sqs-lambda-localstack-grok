# sqs-lambda-localstack-grok

Setup Instructions

1. Ensure LocalStack is running locally (e.g., via Docker: `docker run --rm -it -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack` with services for SQS and Lambda enabled).
1. In a new project directory, `run npm init -y`.
1. Install dependencies: `npm install @aws-sdk/client-sqs @aws-sdk/client-lambda archiver`.
1. Create the files as shown above.
1. Run `node setup.js` to create the SQS queue.
1. Run `node producer.js` to send 100 documents.
1. Create the consumer folder with `index.js` inside.
1. Run `node deploy.js` to deploy the Lambda and configure the SQS trigger.
1. The Lambda will automatically consume and print the messages in pretty JSON format to its logs. To view logs, use AWS CLI pointed to LocalStack: `aws --endpoint-url=http://localhost:4566 logs tail /aws/lambda/my-consumer`.
