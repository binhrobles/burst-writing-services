import DynamoDB from 'aws-sdk/clients/dynamodb';

const DDB = new DynamoDB();

async function PutResourceToTable({
  TableName,
  Item,
}: {
  TableName: string;
  Item: Record<string, Record<string, string | number>>;
}) {
  const params = {
    TableName,
    Item,
  };
  const result = await DDB.putItem(params).promise();
  console.log(JSON.stringify(result));
  return;
}

const DBClient = {
  PutResourceToTable,
};

export default DBClient;
