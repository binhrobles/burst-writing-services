import { APIGatewayProxyHandler } from 'aws-lambda';
import SSM from 'aws-sdk/clients/ssm';
import axios from 'axios';
import 'source-map-support/register';

let TRANSLATE_API_KEY = '';
const axiosClient = axios.create({
  baseURL: 'https://translation.googleapis.com/language/translate/v2',
});

const getApiKey = async () => {
  const ssm = new SSM();
  const result = await ssm
    .getParameter({
      Name: '/burst-writing/translate/api-key',
      WithDecryption: true,
    })
    .promise();
  return result.Parameter.Value;
};

const handleError = (e: Error) => {
  console.error(JSON.stringify(e, null, 2));
};

export const translate: APIGatewayProxyHandler = async (event) => {
  try {
    if (!TRANSLATE_API_KEY) {
      TRANSLATE_API_KEY = await getApiKey();
    }

    const target = event.multiValueQueryStringParameters.target[0];
    const text = event.multiValueQueryStringParameters.q[0];

    const response = await axiosClient.get(
      `?key=${TRANSLATE_API_KEY}&target=${target}&q=${text}`
    );
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
    };
  }
};
