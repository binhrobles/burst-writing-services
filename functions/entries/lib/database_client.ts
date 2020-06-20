import DynamoDB from 'aws-sdk/clients/dynamodb';

const config = process.env.IS_OFFLINE
  ? {
      endpoint: 'http://localhost:4566',
    }
  : {};
const dynamo = new DynamoDB.DocumentClient(config);

async function CreateEntry({
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
  const now = Date.now();
  const Item = {
    CreateTime: now,
    Prompt: prompt,
    Prompt_CreateTime: `${prompt}_${now}`,
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
  console.log(JSON.stringify(result.ConsumedCapacity));
}

async function GetUserEntries({ user }: { user: string }): Promise<Array<any>> {
  // only requests fields:
  const projection = 'Prompt, WordBank, CreateTime';
  const result = await dynamo
    .query({
      TableName: 'Entries',
      ExpressionAttributeNames: {
        // because `User` is a DDB reserved word
        '#user': 'User',
      },
      ExpressionAttributeValues: {
        ':user': user,
      },
      KeyConditionExpression: '#user = :user',
      ProjectionExpression: projection,
    })
    .promise();
  console.log(JSON.stringify(result.ConsumedCapacity));

  return result.Items;
}

const DBClient = {
  CreateEntry,
  GetUserEntries,
};

export default DBClient;
