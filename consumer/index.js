// consumer/index.js - Lambda handler code
exports.handler = async (event) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    console.log(JSON.stringify(body, null, 2));
  }
  return { statusCode: 200 };
};
