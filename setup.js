// setup.js - Run this first to create the SQS queue
const { SQSClient, CreateQueueCommand } = require("@aws-sdk/client-sqs");

const sqsClient = new SQSClient({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

async function main() {
  try {
    const data = await sqsClient.send(
      new CreateQueueCommand({ QueueName: "my-queue" })
    );
    console.log("Queue created with URL:", data.QueueUrl);
  } catch (err) {
    console.error("Error creating queue:", err);
  }
}

main();
