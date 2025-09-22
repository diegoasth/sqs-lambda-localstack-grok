// producer.js - Run this after setup.js to produce 100 documents to the SQS queue
const { SQSClient, SendMessageBatchCommand } = require("@aws-sdk/client-sqs");

const sqsClient = new SQSClient({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

async function main() {
  const queueUrl = "http://localhost:4566/000000000000/my-queue";

  for (let batch = 0; batch < 10; batch++) {
    const entries = [];
    for (let i = 0; i < 10; i++) {
      const index = batch * 10 + i + 1;
      const document = {
        name: `person-${Math.random().toString(36).substring(2, 10)}`, // Random string for name
        age: Math.floor(Math.random() * 100) + 1, // Random age 1-100
      };
      entries.push({
        Id: `${index}`,
        MessageBody: JSON.stringify(document),
      });
    }

    try {
      await sqsClient.send(
        new SendMessageBatchCommand({
          QueueUrl: queueUrl,
          Entries: entries,
        })
      );
      console.log(`Batch ${batch + 1} sent successfully`);
    } catch (err) {
      console.error(`Error sending batch ${batch + 1}:`, err);
    }
  }
}

main();
