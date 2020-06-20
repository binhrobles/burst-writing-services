import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import DBClient from './lib/database_client';

const handleError = (e: Error) => {
  console.error(JSON.stringify(e, null, 2));
};

// TODO: rip userId from OAuth creds
export const CreateEntry: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    await DBClient.CreateEntry(body);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'OK' }),
    };
  } catch (e) {
    handleError(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};

export const GetUserEntries: APIGatewayProxyHandler = async (event) => {
  try {
    // TODO: this won't work since GET requests don't have bodies
    //       need to have a user token
    const body = JSON.parse(event.body);
    const entries = await DBClient.GetUserEntries(body);

    return {
      statusCode: 200,
      body: JSON.stringify(entries),
    };
  } catch (e) {
    handleError(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
