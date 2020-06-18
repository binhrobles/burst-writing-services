import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

const handleError = (e: Error) => {
  console.error(JSON.stringify(e, null, 2));
};

export const create: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    return {
      statusCode: 200,
      body: JSON.stringify(body),
    };
  } catch (e) {
    handleError(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
