# burst-writing-services

## Stack

- [Serverless](https://www.serverless.com/) for API Gateway and function creation
- [LocalStack](https://github.com/localstack/localstack) for local AWS service mocking
- Non-serverless specific infra being created [here](https://github.com/binhrobles-burst-writing/burst-writing-shared-infra)

## Usage

### Locally

- For local dev, testing, and quick feedback
- `yarn start` should raise localstack docker container and start the API in offline mode
- `yarn provision` will PUT the API key needed for the translate API in the localstack SSM
  - TODO: preserve this in state
- Lambdas are available behind `localhost:4000/dev`

### Personal Stack

- For testing with real/shared infrastructure, integration tests, pre-commit smoke test
- `yarn deploy:personal` should deploy a personal stack using the machine's `whoami` value
- Lambdas are available behind `burst-api.binhrobles.com/{whoami}`
- Cleanup! `yarn destroy:personal`

### Deploying

#### Manual Steps

- Domain registered and updated in `serverless.yml/custom/customDomain`
- Certificate created in ACM
- Custom domain created with: `sls create_domain`
  - could've done this in terraform, but seems like serverless-custom-domain plugin expects some CFN outputs to be made available for the function deployments to work

#### Handled by Deployment Pipeline

- Github Action
  - Create commit artifact w/ `sls package -s prod`
  - Uploads artifact to S3 bucket
- Triggers a CodePipeline flow which kicks off deploys for the envs

  - Source Stage watches S3 bucket location
  - "Build" Stage uses CodeBuild to deploy artifact into this env
  - Wouldn't actually currently work, since `sls package` injects env-specific info at package time
  - Moving away from using Code\* because free tier will expire soon and really not getting much out of it

- `serverless-custom-domain` creates a path off the root domain to the deployed stage

#### Post-Deploy Manual Steps

- In the `Serverless Domain Manager Summary` or in `API Gateway->Custom Domain Names->{your domain name}`, find the generated `Target Domain`
- **FRAGILE**: In your domain config, point your domain to the `Target Domain`
  - Target Domain will change if stack is torn down, but not during redeployments
