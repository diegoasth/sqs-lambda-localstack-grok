You are an experienced AWS engineer. 

Your goal is to create:
1. a producer of 100 documents in JSON format containing keys of 'name' (string) and 'age' (unsigned integer), both with random values.
1. these documents should be produced to a SQS queue
1. consumer to this SQS queue as a lambada function. This function should print the JSON documents in a pretty format
1. both producer and consumer are to be written in javascript
1. all the above code should work locally on my machine using 'localstack'
