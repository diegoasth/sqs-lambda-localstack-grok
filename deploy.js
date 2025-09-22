// deploy.js - Run this after producer.js to deploy the Lambda and set up SQS trigger
const { LambdaClient, CreateFunctionCommand, CreateEventSourceMappingCommand } = require("@aws-sdk/client-lambda");
const { SQSClient, GetQueueAttributesCommand } = require("@aws-sdk/client-sqs");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

const lambdaClient = new LambdaClient({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

const sqsClient = new SQSClient({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

async function zipDir(sourceDir, outPath) {
  const output = fs.createWriteStream(outPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(output);
  archive.directory(sourceDir, false);
  await archive.finalize();

  return new Promise((resolve, reject) => {
    output.on("close", resolve);
    archive.on("error", reject);
  });
}

async function main() {
  const zipPath = path.join(__dirname, "consumer.zip");
  await zipDir(path.join(__dirname, "consumer"), zipPath);
  const zipBuffer = fs.readFileSync(zipPath);

  try {
    // Create Lambda function
    await lambdaClient.send(
      new CreateFunctionCommand({
        FunctionName: "my-consumer",
        Runtime: "nodejs18.x",
        Handler: "index.handler",
        Code: { ZipFile: zipBuffer },
        Role: "arn:aws:iam::000000000000:role/lambda-role", // Dummy role for LocalStack
      })
    );
    console.log("Lambda function created");

    // Get SQS queue ARN
    const queueData = await sqsClient.send(
      new GetQueueAttributesCommand({
        QueueUrl: "http://localhost:4566/000000000000/my-queue",
        AttributeNames: ["QueueArn"],
      })
    );
    const queueArn = queueData.Attributes.QueueArn;

    // Create event source mapping
    await lambdaClient.send(
      new CreateEventSourceMappingCommand({
        FunctionName: "my-consumer",
        EventSourceArn: queueArn,
        BatchSize: 10,
      })
    );
    console.log("Event source mapping created");
  } catch (err) {
    console.error("Error during deployment:", err);
  } finally {
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
  }
}

main();
