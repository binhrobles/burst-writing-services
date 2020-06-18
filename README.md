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

#### Manual Steps

- Domain registered and updated in `serverless.yml/custom/customDomain`
- Certificate created in ACM
- Custom domain created with: `sls create_domain`
  - could've done this in terraform, but seems like serverless-custom-domain plugin expects some CFN outputs to be made available for the function deployments to work

#### Handled by Github Action

- Create commit artifact w/ `sls package -s prod`
- Uploads artifact to S3 bucket
- Triggers a CodePipeline flow which kicks off deploys for the envs

  - Wouldn't actually currently work, since `sls package` injects env-specific info at package time

- `serverless-domain-manager` creates a path off the root domain to the deployed stage

#### Post-Deploy Manual Steps

- In the `Serverless Domain Manager Summary` or in `API Gateway->Custom Domain Names->{your domain name}`, find the generated `Target Domain`
- **FRAGILE**: In your domain config, point your domain to the `Target Domain`
  - Target Domain will change if stack is torn down, but not during redeployments
