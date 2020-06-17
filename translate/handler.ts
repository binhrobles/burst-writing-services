import { APIGatewayProxyHandler } from 'aws-lambda';
import axios from 'axios';
import 'source-map-support/register';

const TRANSLATE_API_KEY = process.env.TRANSLATE_API_KEY;
if (!TRANSLATE_API_KEY ||
  TRANSLATE_API_KEY === undefined ||
  TRANSLATE_API_KEY === 'undefined'
) throw new Error('Missing API key');

const axiosClient = axios.create({
  baseURL: 'https://translation.googleapis.com/language/translate/v2',
});

function handleError(e: any) {
  console.error(JSON.stringify(e, null, 2));
}

export const translate: APIGatewayProxyHandler = async (event, _context) => {
  // TODO: input verification
  const target = event.multiValueQueryStringParameters.target[0];
  const text = event.multiValueQueryStringParameters.q[0];

  try {
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
      body: null,
    }
  }
}
