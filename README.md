# burst-writing-services

## Stack

- [Serverless](https://www.serverless.com/) for API Gateway and function creation
- [LocalStack](https://github.com/localstack/localstack) for local AWS service mocking
- Non-serverless specific infra being created [here](https://github.com/binhrobles-burst-writing/burst-writing-shared-infra)

## Usage

### Locally

- `yarn start` should raise localstack docker container and start the API in offline mode
- `./provision-localstack.sh` will PUT the API key needed for the translate API in the localstack SSM
  - TODO: preserve this in state

### Deploying

- Domain registered and updated in `serverless.yml/custom/customDomain`
- Certificate created in ACM
- Custom domain created with: `sls create_domain`
  - could've done this in terraform, but seems like serverless-custom-domain plugin expects some CFN outputs to be made available for the function deployments to work
- Deploy API w/ `sls deploy -s prod`
- In the `Serverless Domain Manager Summary` or in `API Gateway->Custom Domain Names->{your domain name}`, find the generated `Target Domain`
- **FRAGILE**: In your domain config, point your domain to the `Target Domain`
  - Target Domain will change if stack is torn down, but not during redeployments
