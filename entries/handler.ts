import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import 'source-map-support/register';

const handleError = (e: any) => {
  console.error(JSON.stringify(e, null, 2));
}

export const translate: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const target = event.multiValueQueryStringParameters.target[0];
    const text = event.multiValueQueryStringParameters.q[0];

    const response = await axiosClient.get(`?key=${TRANSLATE_API_KEY}&target=${target}&q=${text}`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        translation: response.data.data.translations[0].translatedText,
      }),
    };
  } catch (e) {
    handleError(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    }
  }
}
