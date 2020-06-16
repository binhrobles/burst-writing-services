echo 'putting api key to ssm...'
aws --endpoint-url=http://localhost:4566 ssm put-parameter \
  --name "/burst-writing/translate/api-key" \
  --value $(cat ~/.credentials/burst-writing-translate-api.txt) \
  --type "SecureString"
