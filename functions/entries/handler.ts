import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import DBClient from './lib/database_client';

const handleError = (e: Error) => {
  console.error(JSON.stringify(e, null, 2));
};

// TODO: rip userId from OAuth creds
export const create: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const Item = {
      Prompt_User: {
        S: `${body.prompt}_${body.user}`,
      },
      Prompt: {
        S: body.prompt,
      },
      User: {
        S: body.user,
      },
      Text: {
        S: body.text,
      },
      CreateTime: {
        N: Date.now(),
      },
    };
    // TODO: ensure this is rendered properly
    if (body.wordbank) {
      Item['WordBank'] = {
        SS: body.wordbank,
      };
    }
    await DBClient.PutResourceToTable({ TableName: 'Entries', Item });

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
