import DynamoDB from 'aws-sdk/clients/dynamodb';

const config = process.env.IS_OFFLINE
  ? {
      endpoint: 'http://localhost:4566',
    }
  : {};
const dynamo = new DynamoDB.DocumentClient(config);

async function PutEntry({
  prompt,
  text,
  user,
  wordbank = null,
}: {
  prompt: string;
  text: string;
  user: string;
  wordbank: Array<string>;
}): Promise<void> {
  // DDB item mapping
  const Item = {
    CreateTime: Date.now(),
    Prompt: prompt,
    Prompt_User: `${prompt}_${user}`,
    Text: text,
    User: user,
    WordBank: wordbank,
  };

  // put it, letting DocumentClient do the type mapping for us
  const result = await dynamo
    .put({
      TableName: 'Entries',
      Item,
    })
    .promise();
  console.log(JSON.stringify(result));
}

const DBClient = {
  PutEntry,
};

export default DBClient;
